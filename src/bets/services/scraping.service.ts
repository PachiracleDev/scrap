import { Injectable, BadRequestException } from '@nestjs/common';

import { Cluster } from 'puppeteer-cluster';

const getUrls = (category: string) => {
  switch (category) {
    case 'tennis':
      return [
        'https://betway.com/es/sports/cat/tennis',
        'https://www.pinnacle.com/es/tennis/matchups',
        'https://888starz.bet/es/line/tennis',
      ];

    case 'basketball':
      return [
        'https://betway.com/es/sports/cat/basketball',
        'https://www.pinnacle.com/es/basketball/matchups',
      ];

    default:
      break;
  }
};

const AllCategories = ['tennis', 'basketball'];

@Injectable()
export class ScrapingService {
  async findAll(category: string) {
    if (!AllCategories.includes(category)) {
      throw new BadRequestException('Category not found');
    }

    const bets = [];

    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 100,
      monitor: true,
      puppeteerOptions: {
        headless: false,
        defaultViewport: null,
        userDataDir: './tmp',
      },
    });

    cluster.on('taskerror', (err, data) => {
      console.log(`Error crawling ${data}: ${err.message}`);
    });

    await cluster.task(async ({ page, data: url }) => {
      await page.goto(url);

      switch (url) {
        case `https://betway.com/es/sports/cat/${category}`: {
          await page.waitForSelector('div.eventHolder');
          const betsHandles = await page.$$('div.eventHolder');

          for (const bet of betsHandles.slice(0, 10)) {
            let firstTeam = 'Null';
            let secoundTeam = 'Null';
            let one = 'Null';
            let two = 'Null';

            try {
              firstTeam = await page.evaluate(
                (el) =>
                  el.querySelector('span.teamNameHomeTextFirstPart')
                    .textContent,
                bet,
              );
            } catch (error) {}
            try {
              secoundTeam = await page.evaluate(
                (el) =>
                  el.querySelector('span.teamNameAwayTextFirstPart')
                    .textContent,
                bet,
              );
            } catch (error) {}

            try {
              one = await page.evaluate(
                (el) =>
                  el.querySelector(
                    'div.baseOutcomeItem:nth-of-type(2) div.odds',
                  ).textContent,
                bet,
              );
            } catch (error) {}

            try {
              two = await page.evaluate(
                (el) =>
                  el.querySelector(
                    'div.baseOutcomeItem:nth-of-type(3) div.odds',
                  ).textContent,
                bet,
              );
            } catch (error) {}

            if (one == 'Null' || one == '-' || two == 'Null' || two == '-') {
              continue;
            }

            bets.push({
              page: 'Betway',
              category,
              firstTeam,
              secoundTeam,
              teamOne: one,
              teamTwo: two,
            });
          }
          break;
        }

        case `https://www.pinnacle.com/es/${category}/matchups`: {
          await page.waitForSelector('div.style_row__3hCMX');

          const betsHandles = await page.$$('div.style_row__3hCMX');
          for (const bet of betsHandles.slice(0, 10)) {
            let firstTeam = 'Null';
            let secoundTeam = 'Null';
            let one = 'Null';
            let two = 'Null';

            try {
              firstTeam = await page.evaluate(
                (el) =>
                  el.querySelector('div.ellipsis:nth-of-type(1) span')
                    .textContent,
                bet,
              );
            } catch (error) {}
            try {
              secoundTeam = await page.evaluate(
                (el) =>
                  el.querySelector('div.ellipsis:nth-of-type(2) span')
                    .textContent,
                bet,
              );
            } catch (error) {}

            try {
              one = await page.evaluate(
                (el) =>
                  el.querySelector(
                    '.style_moneyline__bFpDe div:nth-of-type(1) span',
                  ).textContent,
                bet,
              );
            } catch (error) {}

            try {
              two = await page.evaluate(
                (el) =>
                  el.querySelector(
                    '.style_moneyline__bFpDe div:nth-of-type(2) span',
                  ).textContent,
                bet,
              );
            } catch (error) {}

            if (one == 'Null') {
              continue;
            }

            bets.push({
              page: 'Pinnacle',
              category,
              firstTeam,
              secoundTeam,
              teamOne: one,
              teamTwo: two,
            });
          }
          break;
        }

        case `https://888starz.bet/es/line/${category}`: {
          await page.waitForSelector('div.c-events__item_game');

          const betsHandles = await page.$$('div.c-events__item_game');

          for (const bet of betsHandles.slice(0, 10)) {
            let firstTeam = 'Null';
            let secoundTeam = 'Null';
            let one = 'Null';
            let two = 'Null';
            try {
              firstTeam = await page.evaluate(
                (el) =>
                  el.querySelector('span.c-events__team:nth-of-type(1)')
                    .textContent,
                bet,
              );
            } catch (error) {}
            try {
              secoundTeam = await page.evaluate(
                (el) =>
                  el.querySelector('span.c-events__team:nth-of-type(2)')
                    .textContent,
                bet,
              );
            } catch (error) {}

            try {
              one = await page.evaluate(
                (el) =>
                  el.querySelector(`[title='1'] span.c-bets__inner`)
                    .textContent,
                bet,
              );
            } catch (error) {}

            try {
              two = await page.evaluate(
                (el) =>
                  el.querySelector(`[title='2'] span.c-bets__inner`)
                    .textContent,
                bet,
              );
            } catch (error) {}

            if (one == 'Null') {
              continue;
            }

            bets.push({
              page: '888starz',
              category,
              firstTeam: firstTeam.trim().replace(/\s+/g, ' '),
              secoundTeam: secoundTeam.trim().replace(/\s+/g, ' '),
              teamOne: one,
              teamTwo: two,
            });
          }
          break;
        }
        default:
          break;
      }
    });

    for (const url of getUrls(category)) {
      await cluster.queue(url);
    }

    await cluster.idle();
    await cluster.close();

    // const browser = await puppeteer.launch({
    //   headless: false,
    //   defaultViewport: null,
    //   userDataDir: './tmp',
    // });
    // const page = await browser.newPage();
    // await page.goto('https://betway.com/es/sports/cat/boxing');
    // const searchResultSelector = 'div.eventHolder';
    // await page.waitForSelector(searchResultSelector);

    // const betsHandles = await page.$$('div.eventHolder');
    // console.log(betsHandles);

    return bets;
  }
}
