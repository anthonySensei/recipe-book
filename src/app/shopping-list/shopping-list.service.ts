import {Subject} from 'rxjs';

import {Ingredient} from '../shared/ingredient.model';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class ShoppingListService {
  startedEditing = new Subject<number>();
  ingredientsChange = new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 6)
  ];

  constructor(private http: HttpClient) {
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients;
    this.ingredientsChange.next(this.ingredients.slice());
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient, userId: string) {
    this.ingredients.push(ingredient);
    this.ingredientsChange.next(this.ingredients.slice());
    this.storeIngredients(userId);
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChange.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient, userId: string){
    this.ingredients[index] = newIngredient;
    this.ingredientsChange.next(this.ingredients.slice());
    this.storeIngredients(userId);
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index, 1);
    this.ingredientsChange.next(this.ingredients.slice());
  }

  storeIngredients(userId: string){
    this.http.put(
      `https://recipe-book-3459a.firebaseio.com/ingredients/${userId}/user-ingredients.json`,
      this.ingredients
    ).subscribe();
  }

}
