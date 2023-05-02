import { Injectable } from '@angular/core';
import { Food } from '../shared/models/Food';
import { sample_foods, sample_tags } from 'src/data';
import { Tag } from '../shared/models/Tag';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FOODS_BY_TAG_URL, FOODS_SEARCH_URL, FOODS_TAGS_URL, FOODS_URL } from '../shared/constants/urls';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) {

  }

  getAll():Observable<Food[]>{
    return this.http.get<Food[]>(FOODS_URL);
  }

  getSearchedFood(searchTerm:string) {
    return this.http.get<Food[]>(FOODS_SEARCH_URL + searchTerm);
  }

  getAllTags():Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  getFoodByTag(tag:string):Observable<Food[]> {
    return tag === "All" ?
    this.getAll() :
    this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
  }

  getFoodById(foodId:string):Observable<Food> {
    return this.http.get<Food>(FOODS_URL + foodId);
  }

}
