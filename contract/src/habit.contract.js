import { E } from '@agoric/eventual-send';
import { makeIssuerKit } from '@agoric/ertp';
import { Far } from '@agoric/marshal';
import { assert } from '@agoric/assert';

/**
 * @param {ZCF} zcf
 * @param {object} privateArgs
 */
export const start = (zcf, privateArgs) => {
  // Create a reward points issuer
  const {
    issuer: rewardIssuer,
    mint: rewardMint,
    brand: rewardBrand,
  } = makeIssuerKit('HabitRewards');

  // Persistent state for habits
  const habits = new Map();
  const userHabits = new Map();
  const pendingApprovals = new Map();

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

    // Clear approval
    pendingApprovals.delete(habitKey);

    // Mint reward tokens
    const rewardAmount = rewardMint.mintPayment(dailyReward);

    return `Check-in approved for habit ${habitId} by ${validator}`;
  };

  // Public and creator facets
  const publicFacet = Far('PublicFacet', {
    checkIn,
  });

  const creatorFacet = Far('CreatorFacet', {
    startHabit,
    approveCheckIn,
  });

  return harden({
    publicFacet,
    creatorFacet,
  });
};
