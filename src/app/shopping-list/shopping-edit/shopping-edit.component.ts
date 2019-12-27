import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';


import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';
import {DataStorageService} from '../../shared/data-storage.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  @Input() ingredients: Ingredient[];
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  userId: string;

  constructor(private sltService: ShoppingListService,
              private dataStorageService: DataStorageService,
              private authService: AuthService) { }

  ngOnInit() {
    this.subscription = this.sltService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedItem = this.sltService.getIngredient(index);
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          });
        }
      );
    this.userId = this.authService.getUserIdentificator();
  }

  onSubmitItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode){
      this.sltService.updateIngredient(this.editedItemIndex, newIngredient, this.userId)
    }else{
      this.sltService.addIngredient(newIngredient, this.userId);
    }
    this.editMode = false;
    form.reset();
  }

  onClear(){
    this.slForm.reset();
    this.sltService.deleteIngredients(this.userId);
    this.editMode = false;
  }

  onDelete(form: NgForm) {
    this.sltService.deleteIngredient(this.editedItemIndex, this.userId);
    this.editMode = false;
    form.reset();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
