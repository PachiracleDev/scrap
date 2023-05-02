import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import config from 'src/config';

@Injectable()
export class OpenAIService {
  private config;
  private openai;
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    this.config = new Configuration({
      apiKey: this.configService.chatgpt.apiKey,
    });
    this.openai = new OpenAIApi(this.config);
  }

  async ask(question: string) {
    console.log(question);
    try {
      const response = await this.openai.createCompletion({
        model: 'text-curie-001',
        prompt: question,
        maxTokens: 60,
        temperature: 1,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }
}
