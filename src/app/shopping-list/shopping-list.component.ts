import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private subscription: Subscription;
  private allIngSubscription: Subscription;
  userId;
  allIngredients: Ingredient[];
  isLoading = false;

  constructor(private slService: ShoppingListService,
              private dataStorageService: DataStorageService,
              private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserIdentificator();
    this.dataStorageService.fetchIngredients(this.userId).subscribe();
    this.dataStorageService.fetchAllIngredients().subscribe();
    this.subscription = this.slService.ingredientsChange
        .subscribe(
          (ingredients: Ingredient[]) => {
            this.ingredients = ingredients;
            this.isLoading = false;
          }
        );
    this.allIngSubscription = this.slService.allIngredientChange
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.allIngredients = ingredients;
        }
      );
    this.ingredients = this.slService.getIngredients();
    this.allIngredients = this.slService.getAllIngredients();
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
