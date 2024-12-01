import { E } from '@agoric/eventual-send';
import { makeIssuerKit, AmountMath } from '@agoric/ertp';

const buildRootObject = () => {
  const VALIDATOR_ROLE = 'VALIDATOR_ROLE';
  const DEFAULT_ADMIN_ROLE = 'DEFAULT_ADMIN_ROLE';

  const habits = new Map(); // User address -> Habit ID -> Habit Object
  const userHabits = new Map(); // User address -> List of habit IDs
  const pendingApprovals = new Map(); // User -> Habit ID -> Approval Status

  const whitelistedTokens = new Map(); // Whitelisted token brands
  const validators = new Set(); // Addresses with validator permissions
  let owner;

  // Rewards
  let dailyReward = 1n; // Default reward
  let profitMultiplier = 1n;
  let breakEvenRatio = 75n; // Default break-even ratio

  // Initialize token mint for rewards
  const {
    issuer: rewardIssuer,
    mint: rewardMint,
    brand: rewardBrand,
  } = makeIssuerKit('RewardPoints', 'nat');

  const setOwner = address => {
    owner = address;
    return `Owner set to ${address}`;
  };

  const setGlobalParameters = (caller, params) => {
    assert(caller === owner, 'Only the owner can set global parameters');
    const { newDailyReward, newProfitMultiplier, newBreakEvenRatio } = params;
    dailyReward = newDailyReward || dailyReward;
    profitMultiplier = newProfitMultiplier || profitMultiplier;
    breakEvenRatio = newBreakEvenRatio || breakEvenRatio;
  
    return `Global parameters updated: DailyReward=${dailyReward}, ProfitMultiplier=${profitMultiplier}, BreakEvenRatio=${breakEvenRatio}`;
  };
  

  // Configuration constants
  const DAILY_REWARD = 1n;
  const PROFIT_MULTIPLIER = 1n;
  const BREAK_EVEN_RATIO = 75n;

  /**
   * Start a new habit for a user
   * @param {string} user
   * @param {bigint} depositAmount
   * @param {Brand} tokenBrand
   * @param {number} maxDays
   * @returns {string} Habit creation confirmation
   */
  const startHabit = (user, depositAmount, tokenBrand, maxDays) => {
    assert(depositAmount > 0n, 'Deposit must be positive');

    const habitId = userHabits.get(user)?.length || 0;
    const currentTime = zcf.getCurrentTime();

    const habit = {
      user,
      depositAmount,
      tokenBrand,
      startTime: currentTime,
      lastCheckIn: currentTime,
      streakDays: 0,
      rewardPoints: 0n,
      active: true,
      maxHabitDays: maxDays,
    };

    const habitKey = `${user}-${habitId}`;
    habits.set(habitKey, habit);
    userHabits.set(user, [...(userHabits.get(user) || []), habitId]);

    return `Habit ${habitId} started for ${user}`;
  };

  /**
   * Request a check-in for a specific habit
   * @param {string} user
   * @param {number} habitId
   * @returns {string} Check-in request confirmation
   */
  const checkIn = (user, habitId) => {
    const habitKey = `${user}-${habitId}`;
    const habit = habits.get(habitKey);

    assert(habit?.active, 'No active habit found');
    assert(habit.streakDays < habit.maxHabitDays, 'Habit completed');
    assert(!pendingApprovals.get(habitKey), 'Check-in already requested');

    pendingApprovals.set(habitKey, true);
    return `Check-in requested for habit ${habitId}`;
  };

  /**
   * Approve a user's check-in
   * @param {string} validator
   * @param {string} user
   * @param {number} habitId
   * @returns {string} Check-in approval confirmation
   */
  const approveCheckIn = (validator, user, habitId) => {
    assert(validators.has(validator), 'Caller is not a validator');

    const habitKey = `${user}-${habitId}`;
    const habit = habits.get(habitKey);

    assert(pendingApprovals.get(habitKey), 'No pending check-in');
    assert(habit?.active, 'Habit not active');

    const currentTime = zcf.getCurrentTime();
    assert(currentTime > habit.lastCheckIn, 'Already checked in today');

    // Update habit progress
    habit.lastCheckIn = currentTime;
    habit.streakDays += 1;

    const breakEvenDays =
      (BigInt(habit.maxHabitDays) * BREAK_EVEN_RATIO) / 100n;

    // Calculate reward points
    const dailyReward =
      BigInt(habit.streakDays) > breakEvenDays
        ? DAILY_REWARD * PROFIT_MULTIPLIER
        : DAILY_REWARD;

    habit.rewardPoints += dailyReward;

    // Mint reward tokens for the user
    const rewardAmount = AmountMath.make(rewardBrand, BigInt(habit.rewardPoints));
    rewardMint.mintPayment(rewardAmount);

    // Clear approval
    pendingApprovals.delete(habitKey);

    // Mint reward tokens
    const rewardAmount = rewardMint.mintPayment(dailyReward);

    return `Check-in approved for habit ${habitId} by ${validator}`;
  };

  const whitelistToken = async (caller, tokenIssuer, tokenBrand) => {
    assert(caller === owner, 'Only the owner can whitelist tokens');
    const isMatchingIssuer = await E(tokenBrand).isMyIssuer(tokenIssuer);
    assert(isMatchingIssuer, 'Issuer and brand do not match');
    whitelistedTokens.set(tokenBrand, true);
    return `Token ${tokenBrand} successfully whitelisted`;
  };
  
  const assignValidator = (caller, validator) => {
    assert(caller === owner, 'Only the owner can assign validators');
    validators.add(validator);
    return `Validator ${validator} assigned`;
  };
  
  const revokeValidator = (caller, validator) => {
    assert(caller === owner, 'Only the owner can revoke validators');
    validators.delete(validator);
    return `Validator ${validator} revoked`;
  };

  const getHabit = (user, habitId) => {
    const habitKey = `${user}-${habitId}`;
    const habit = habits.get(habitKey);
    return habit ? harden({ ...habit }) : 'Habit not found';
  };
  

  const getGlobalParameters = () => {
    return {
      dailyReward,
      profitMultiplier,
      breakEvenRatio,
    };
  };

  return harden({
    setOwner,
    setGlobalParameters,
    startHabit,
    checkIn,
    approveCheckIn,
    whitelistToken,
    assignValidator,
    revokeValidator,
    getHabit,
    getGlobalParameters,
    rewardIssuer, // Expose the rewardIssuer for token management
  });
};
