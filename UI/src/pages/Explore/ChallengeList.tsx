/* eslint-disable */
// @ts-nocheck

import useChallenges from "../../hooks/useChallenges";
import { useNavigation } from "react-router-dom";
import ChallengeCard from "../../components/ChallengeCard";
import { useParams } from "react-router-dom";
import styles from "../../styles/styles";
import { useState } from "react";

const ChallengeList = () => {
  const [page, setPage] = useState(0);
  const [moreChallengesButton, setMoreChallengesButton] = useState(true);
  const { challenges, error } = useChallenges({
    page: page,
    setMoreChallengesButton: setMoreChallengesButton,
  });
  const navigation = useNavigation();

  const params = useParams();
  console.log("challenge here", challenges);
  const participationType = parseInt(params.id || "0");

  // Filter challenges based on participationType
  const filteredChallenges = challenges.filter((challenge) => {
    return (
      challenge.Game && challenge.Game.ParticipationType === participationType
    );
  });

  console.log("here filter challenges", filteredChallenges);

  return (
    <div className="flex flex-col w-full">
      <div className="mx-4">
        <div className={`mt-4 ${styles.heading}`}>
          {participationType === 0
            ? "Dare A friend"
            : participationType === 1
            ? "Versus A friend"
            : participationType === 2
            ? "Multiplayer"
            : "Challenges"}
        </div>
      </div>
      <div>
        {filteredChallenges.length > 0 ? (
          <>
            {filteredChallenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.ChallengeID}
                challenge={challenge}
              />
            ))}
            {moreChallengesButton ? (
              <button
                className="border bg-blue-400 rounded-xl font-semibold text-white p-2 mb-4"
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                Show More Challenges 🔥
              </button>
            ) : (
              <h1 className="my-10">No More Challenges Present!</h1>
            )}
          </>
        ) : (
          <h1 className="my-10">No Challenges Found!</h1>
        )}
      </div>
    </div>
  );
};

export default ChallengeList;
