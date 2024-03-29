import { Injectable } from '@angular/core';
import {
  KeyValuePair,
  KeyValuePairBatch,
  PostsPerMinuteItem,
  PostsSpeed,
  SubredditMention,
  SubredditMentionBatch,
  WordCountBatch, WordData
} from "../other/Entities";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SparkStreamHandlerService {

  public counter: number = 0;
  public i = 0;
  public subredditMentions: SubredditMention[] = []
  public subredditPostsProportion: SubredditMention[] = [];
  public popularCommunitiesObserver: BehaviorSubject<SubredditMention[]> = new BehaviorSubject<SubredditMention[]>(null);
  public subredditPostsProportionObserver: BehaviorSubject<SubredditMention[]> = new BehaviorSubject<SubredditMention[]>(null);
  public results: SubredditMention[] = []
  public postsSpeedList: PostsSpeed[] = [];
  public postsSpeedObserver: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  public postsPerMinuteHistory: PostsPerMinuteItem[] = [];
  public postsPerMinuteObserver: BehaviorSubject<PostsPerMinuteItem> = new BehaviorSubject<PostsPerMinuteItem>(null);
  public wordData: WordData[] = []
  public wordDataObserver: BehaviorSubject<WordData[]> = new BehaviorSubject<WordData[]>(null);
  public nsfwData: KeyValuePair[];
  public nsfwDataObserver: BehaviorSubject<KeyValuePair[]> = new BehaviorSubject<KeyValuePair[]>(null);


  constructor() { }

  handleRedditMentionsBatch(subredditMentionBatch: SubredditMentionBatch) {
    //console.log("New Data: " + JSON.stringify(subredditMentionBatch.data))
    // @ts-ignore
    this.subredditMentions = subredditMentionBatch.data;
    this.popularCommunitiesObserver.next(subredditMentionBatch.data);
  }

  handleRedditPostsProportion(subredditMentionBatch: SubredditMentionBatch) {
    this.subredditPostsProportion = subredditMentionBatch.data;
    this.subredditPostsProportionObserver.next(subredditMentionBatch.data);
  }

  handlePostsSpeed(value: PostsSpeed) {
    this.postsSpeedObserver.next(value.count);
    console.log("New Speed: " + value.count)
    this.postsSpeedList.push(value);
  }

  handlePostsPerMinuteItem(postsPerMinuteItem: PostsPerMinuteItem){
    console.log("New PPM: " + postsPerMinuteItem)
    this.postsPerMinuteHistory.push(postsPerMinuteItem);
    this.postsPerMinuteObserver.next(postsPerMinuteItem);
  }

  handleWordCountBatch(data: WordCountBatch) {
    this.wordData = data.data;
    this.wordDataObserver.next(data.data);
  }

  handleNSFWCountBatch(data: KeyValuePairBatch) {
    if(!data.data) return;
    this.nsfwData = data.data;
    this.nsfwDataObserver.next(data.data);
  }

}
