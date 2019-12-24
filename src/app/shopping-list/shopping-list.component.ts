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
  userId;

  constructor(private slService: ShoppingListService,
              private dataStorageService: DataStorageService,
              private authService: AuthService) { }

  ngOnInit() {
    this.userId = this.authService.getUserIdentificator();
    this.dataStorageService.fetchIngredients(this.userId).subscribe();
    this.subscription = this.slService.ingredientsChange
        .subscribe(
          (ingredients: Ingredient[]) => {
            this.ingredients = ingredients;
          }
        );
    this.ingredients = this.slService.getIngredients();
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
