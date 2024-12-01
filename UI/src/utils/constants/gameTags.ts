// Utility function to get game type string from numeric type
const getGameTypeString = (gameType : number) => {
    switch (gameType) {
      case 0:
        return "Step Based";
      case 1:
        return "Calorie Based";
      case 2:
        return "Proof Based";
      case 3:
        return "Validator Based";
      case 4:
        return "Voting Based";
      default:
        return "";
    }
  };

  const getGameTypeNotes = (gameType) => {
    switch (gameType) {
      case 0:
        return [
          "Fitness tracking app must be active.",
          "All steps are counted - indoors or outdoors.",
          "Challenge must be completed within 24 hours."
        ];
      case 1:
        return [
          "Fitness tracking app must be active.",
          "All burned calories count - any activity.",
          "Challenge must be completed within 24 hours."
        ];
      case 2:
        return [
          "Nodes validate in the background.",
          "Challenge must be completed within 24 hours."
        ];
      case 3:
        return [
          "Nodes validate in the background.",
          "Challenge must be completed within 24 hours."
        ];
      case 4:
        return [
          "Submissions are public.",
          "Catoff users can vote for your submissions.",
          "Share and grab votes to have a chance at the prize pool!"
        ];
      default:
        return [];
    }
  };
  
  const getParticipationTypeString = (participationType : number) => {
    switch (participationType) {
      case 0:
        return "Dare a Player";
      case 1:
        return "Versus a Player";
      case 2:
        return "Multiplayer";
      default:
        return "";
    }
  };
  
  const getCategoryString = (gameType : number) => {
    switch (gameType) {
      case 0:
      case 1:
        return "Fitness";
      case 2:
        return "Proof";
      case 3:
        return "Validator";
      case 4:
        return "Voting";
      default:
        return "";
    }
  };
  const getUnit = (gameType: number) => {
    console.log("getUnit called with gameType:", gameType);
    switch (gameType) {
      case 0:
        return "Steps";
      case 1:
        return "calories";
      case 2:
      case 3:
        return ""; // Ensure this is the desired return for these cases
      case 4:
        return "votes";
      default:
        return "hi"; // Handle any unexpected gameType values
    }
  };
  
  
  
  export { getCategoryString, getParticipationTypeString, getGameTypeString , getGameTypeNotes, getUnit};
