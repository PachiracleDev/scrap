import { Injectable } from '@nestjs/common';

type Bet = {
  page: string;
  category: string;

  firstTeam;
  secoundTeam;
  teamOne: string;
  teamTwo: string;
};
@Injectable()
export class BetsService {
  commonBets(bets: Bet[]) {
    const commucommonParties = <Bet[]>[];
    const betsNames = bets.map((b) => b.firstTeam + ' ' + b.secoundTeam);

    return commucommonParties;
  }

  findCoincidentMatches(matches: Bet[]) {
    const coincidentMatches = [];

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const { firstTeam, secoundTeam } = match;

      for (let j = i + 1; j < matches.length; j++) {
        const otherMatch = matches[j];
        const { firstTeam: otherFirstTeam, secoundTeam: otherSecoundTeam } =
          otherMatch;

        if (
          this.areSimilar(firstTeam, otherFirstTeam, 0.5) &&
          this.areSimilar(secoundTeam, otherSecoundTeam, 0.5)
        ) {
          coincidentMatches.push(match, otherMatch);
        }
      }
    }

    return coincidentMatches;
  }

  areSimilar(str1: string, str2: string, threshold: number): boolean {
    const set1 = new Set(str1);
    const set2 = new Set(str2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    const similarity = intersection.size / union.size;
    return similarity >= threshold;
  }
}
