export interface UserDetails {
  User: any;
  UserName: string;
  // Add other user details properties as needed
}

export interface Challenge {
  SideBetsWager: number;
  ChallengeID: number;
  ChallengeName: string;
  ChallengeDetails: string;
  ProfilePicture: string;
  Target?: number;
  StartDate: string;
  EndDate: string;
  Wager: number;
  WagerStaked?: number;
  TotalWagerStaked?: number;
  GameType?: number;
  ChallengeDescription: string;
  MaxParticipants: number;
  MinParticipants?: number;
  ParticipationType: number;
  State: string;
  Players?: { UserName: string }[];
  StakedWager: number;
  Currency: string;
  ChallengeCreator?: {
    UserName: string;
  };
  Game?: {
    ParticipationType: number;
  };
  ParticipantsJoined?: number;
  // Add other challenge properties as needed
}
export interface Player {
  UserName: string;
}

export interface Performance {
  ChallengeCreatorImage: string;
  ChallengeCreatorUsername: string;
  ChallengeDescription: string;
  ChallengeMedia: string | null;
  ChallengeName: string;
  ChallengeWinner: any[]; // Define a proper type if you know the structure
  EndDate: string;
  GameName: string;
  GameType: string;
  ParticipationType: string;
  Player: Player[]; // Assuming Player has a known structure
  PlayersJoined: number;
  StakedWager: number;
  StartDate: string;
  State: string;
  Target: number;
  TotalWagerStaked: number;
  Value: number;
}
