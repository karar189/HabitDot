// @agoric
import { E } from '@agoric/eventual-send';
import { makeIssuerKit } from '@agoric/ertp';

const buildRootObject = () => {
  const VALIDATOR_ROLE = 'VALIDATOR_ROLE';
  const DEFAULT_ADMIN_ROLE = 'DEFAULT_ADMIN_ROLE';

  const habits = new Map(); // User address -> Habit ID -> Habit Object
  const userHabits = new Map(); // User address -> List of habit IDs
  const pendingApprovals = new Map(); // User -> Habit ID -> Approval Status

  const whitelistedTokens = new Map(); // Whitelisted token brands
  let owner;

  // Rewards
  const dailyReward = 1n; // Default reward
  const profitMultiplier = 1n;
  const breakEvenRatio = 75n; // Default break-even ratio

  // Initialize token mint for rewards
  const {
    issuer: rewardIssuer,
    mint: rewardMint,
    brand: rewardBrand,
  } = makeIssuerKit('RewardPoints');

  const startHabit = (user, depositAmount, tokenBrand, maxDays) => {
    // Validate deposit
    assert(depositAmount > 0, 'Deposit required');
    assert(whitelistedTokens.has(tokenBrand), 'Token not whitelisted');

    // Initialize habit data
    const habitId = userHabits.get(user)?.length || 0;
    const habit = {
      depositAmount,
      tokenBrand,
      startTime: Date.now(),
      lastCheckIn: Date.now(),
      streakDays: 0,
      rewardPoints: 0,
      active: true,
      maxHabitDays: maxDays,
    };

    // Update mappings
    habits.set(`${user}-${habitId}`, habit);
    userHabits.set(user, [...(userHabits.get(user) || []), habitId]);

    return `Habit ${habitId} started for user ${user}`;
  };

  const checkIn = (user, habitId) => {
    const habitKey = `${user}-${habitId}`;
    const habit = habits.get(habitKey);
    assert(habit?.active, 'No active habit for this ID');
    assert(habit.streakDays < habit.maxHabitDays, 'Habit is completed!');
    assert(!pendingApprovals.get(habitKey), 'Check-in already requested');

    pendingApprovals.set(habitKey, true);
    return `Check-in requested for habit ${habitId}`;
  };

  const approveCheckIn = (validator, user, habitId) => {
    const habitKey = `${user}-${habitId}`;
    const habit = habits.get(habitKey);
    assert(pendingApprovals.get(habitKey), 'No pending check-in');
    assert(habit?.active, 'Habit is not active');
    assert(
      Date.now() > habit.lastCheckIn,
      'Check-in already approved for today',
    );

    // Update streak and rewards
    habit.lastCheckIn = Date.now();
    habit.streakDays += 1;
    const breakEvenDays = (BigInt(habit.maxHabitDays) * breakEvenRatio) / 100n;

    if (BigInt(habit.streakDays) > breakEvenDays) {
      habit.rewardPoints += dailyReward * profitMultiplier;
    } else {
      habit.rewardPoints += dailyReward;
    }

    // Clear approval
    pendingApprovals.delete(habitKey);
    return `Check-in approved for habit ${habitId} by validator ${validator}`;
  };

  const whitelistToken = tokenBrand => {
    whitelistedTokens.set(tokenBrand, true);
    return `Token ${tokenBrand} whitelisted`;
  };

  return harden({
    startHabit,
    checkIn,
    approveCheckIn,
    whitelistToken,
  });
};

harden(buildRootObject);
export { buildRootObject };
