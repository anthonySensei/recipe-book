import {Subject} from 'rxjs';

import {Ingredient} from '../shared/ingredient.model';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class ShoppingListService {
  startedEditing = new Subject<number>();
  ingredientsChange = new Subject<Ingredient[]>();
  allIngredientChange = new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [];
  private allIngredients: Ingredient[] = [];

  constructor(private http: HttpClient) {
  }

  getAllIngredients(){
    return this.allIngredients;
  }

  getIngredients() {
    if (this.ingredients === null){
      return this.ingredients;
    }else{
      return this.ingredients.slice();
    }
  }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients;
    if (this.ingredients === null){
      this.ingredientsChange.next(this.ingredients);
    }else {
      this.ingredientsChange.next(this.ingredients.slice());
    }
  }

  setAllIngredients(ingredients: Ingredient[]) {
    this.allIngredients = ingredients;
    this.allIngredientChange.next(this.allIngredients);
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient, userId: string) {
    if (this.ingredients === null){
      this.ingredients = [];
    }
    this.ingredients.push(ingredient);
    this.ingredientsChange.next(this.ingredients.slice());
    this.storeIngredients(userId);
  }

  addIngredients(ingredients: Ingredient[], userId: string) {
    if (this.ingredients === null){
      this.ingredients = [];
    }
    this.ingredients.push(...ingredients);
    this.ingredientsChange.next(this.ingredients.slice());
    this.storeIngredients(userId);
  }

  updateIngredient(index: number, newIngredient: Ingredient, userId: string){
    this.ingredients[index] = newIngredient;
    this.ingredientsChange.next(this.ingredients.slice());
    this.storeIngredients(userId);
  }

  deleteIngredient(index: number, userId: string){
    this.ingredients.splice(index, 1);
    this.ingredientsChange.next(this.ingredients.slice());
    this.http.delete(
      `https://recipe-book-3459a.firebaseio.com/ingredients/${userId}/user-ingredients/${index}.json`
    ).subscribe();
    this.storeIngredients(userId);
  }

  deleteIngredients(userId: string){
    this.ingredients.splice(0, this.ingredients.length);
    this.ingredientsChange.next(this.ingredients);
    this.http.delete(
      `https://recipe-book-3459a.firebaseio.com/ingredients/${userId}/user-ingredients.json`
    ).subscribe();
  }

  storeIngredients(userId: string){
    this.http.put(
      `https://recipe-book-3459a.firebaseio.com/ingredients/${userId}/user-ingredients.json`,
      this.ingredients
    ).subscribe();
  }

}
