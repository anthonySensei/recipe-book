import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {map, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Ingredient} from './ingredient.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private shoppingListService: ShoppingListService
  ) {
  }


  storeRecipes() {

    const recipes = this.recipeService.getRecipes();
    this.http.put(
      'https://recipe-book-3459a.firebaseio.com/recipes.json',
      recipes
    ).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {

    return this.http
      .get<Recipe[]>(
        'https://recipe-book-3459a.firebaseio.com/recipes.json'
      ).pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }));
  }


  fetchIngredients(userId: string) {
    return this.http
      .get<Ingredient[]>(
        `https://recipe-book-3459a.firebaseio.com/ingredients/${userId}/user-ingredients.json`
      ).pipe(
        tap(ingredients => {
          this.shoppingListService.setIngredients(ingredients);
        }));
  }

  fetchAllIngredients() {
    return this.http
      .get<Ingredient[]>(
        'https://recipe-book-3459a.firebaseio.com/allIngredients.json'
      ).pipe(
        tap(ingredients => {
          this.shoppingListService.setAllIngredients(ingredients);
        }));
  }


}
