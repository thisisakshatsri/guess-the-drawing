import { Injectable } from "@angular/core";

import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GenerativeService {
  getModel(): GenerativeModel {
    const api = new GoogleGenerativeAI(
      'AIzaSyD9_GkZi35940ZuTMUEwJc9YLbauhkCTh4'
    );
    return api.getGenerativeModel({ model: 'gemini-pro-vision' });
  }
}