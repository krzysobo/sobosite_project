import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, ChangeDetectorRef, Inject, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../_utils/services/admin/admin.service';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, ValidatorFn, 
  AbstractControl, ValidationErrors } from '@angular/forms'

// import { MatCardModule } from '@angular/material/card'
// import { MatCheckboxModule } from '@angular/material/checkbox'
// import { MatInputModule } from '@angular/material/input'
// import { MatButtonModule } from '@angular/material/button'
// import { CommonModule } from '@angular/common'
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { UniResponse } from '../../_utils/http/uniresponse';
// import { ResponseUtils } from '../../_utils/http/responses';

import {AfterViewInit, ViewChild} from '@angular/core';

// table imports
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';

import {
  MatDialog,
} from '@angular/material/dialog';
import { DeleteUserDialog } from './dialogs/delete-user-dialog';
import { UserStateService } from '../../_utils/services/user-state-service.service';


class Chd extends ChangeDetectorRef {
  markForCheck() : void {}
  detach(): void {}
  detectChanges(): void {}
  checkNoChanges(): void {}
  reattach(): void {}
}




@Component({
  selector: 'app-admin-user-list',
  standalone: false,
  // imports: [MatCardModule, FormsModule, MatInputModule, MatButtonModule, MatCheckboxModule, 
  //   ReactiveFormsModule, CommonModule,  MatPaginatorModule,
  //   MatSortModule, MatFormFieldModule, MatSort, RouterLink, MatTableModule
  // ],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.scss',  
})
export class AdminUserListComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly delete_dialog = inject(MatDialog);
  columns_to_show = ['id','email', 'first_name', "last_name", 'is_active', 'is_staff', 'actions'];
  private _items: any[] = [];
  public my_id: string = "";


  data_source: MatTableDataSource<any> = <MatTableDataSource<any>>{};
  // @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  // @ViewChild(MatSort) sort: MatSort = <MatSort>{};
  // https://stackoverflow.com/questions/67043781/angular-material-pagination-and-sorting-issue
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(), new Chd());
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(
        private route: ActivatedRoute, 
        private userStateService: UserStateService,
        private adminService: AdminService) { 
    this.init_data_source();

    const cur_user = this.userStateService.get_current_user();
    this.my_id = ((cur_user != null) && (cur_user.id !=null))? cur_user.id: "";
  }

  init_data_source() {
    this.data_source = new MatTableDataSource(this._items);
    this.data_source.paginator = this.paginator;
    this.data_source.sort = this.sort;
  }

  ngAfterViewInit() {
    this.data_source.paginator = this.paginator;
    this.data_source.sort = this.sort;
  }  

  refresh_items() {
    this.adminService.admin_user_list_get().subscribe({ 
      next: (resp: any) => {
        // console.log("AdminUserEditComponent - list - data: ", resp);
        if ((resp.body != null) && (resp.body.data != undefined) && (resp.body.data != null)) {
          this._items = resp.body['data'];
         this.init_data_source();
        }
      }, 
      error: (resp: any) => {
        console.log("AdminUserListComponent - error", resp);
      },
      complete: () => {}
  });

  }

  ngOnInit() {
    this.refresh_items();
  }

  ngOnDestroy() {
    
  }

  open_delete_dialog(user_row: any, enter_animation_duration: string, exit_animation_duration: string): void {
    const dialog_ref = this.delete_dialog.open(
      DeleteUserDialog, {
        width: '600px',
        height: '300px',
        enterAnimationDuration: enter_animation_duration,
        exitAnimationDuration: exit_animation_duration, 
        data: {
          email: user_row['email'],
          first_name: user_row['first_name'],
          last_name: user_row['last_name'],
        }
    });

    dialog_ref.afterClosed().subscribe(res => {
      // console.log("====== dialog closed - res: ", res);
    });
     
    const dialog_confirm_click_sub = dialog_ref.componentInstance.confirm_clicked.subscribe(
          (res: any) => {
        console.log("==== confirm clicked observer: ", res);
        if (res === true) {
          console.log("==== deletion has been confirmed");
          this.adminService.admin_user_delete(user_row['id']).subscribe({
            next: (resp) => {
              console.log("DELETION resp", resp);
              this.refresh_items();
            },
            error: (resp) => {
              console.log("DELETION ERRORS RESP", resp);
            },
            complete: () => {}
          })

        }
        dialog_confirm_click_sub.unsubscribe();
    });
  }


  delete_item(item_row: any) {
    this.open_delete_dialog(item_row, '10ms', '10ms');
  }

  get data_rows() {
    return this.data_source;
  }

  get data_rows_count() {
    return this._items.length;
  }

  filterTheList(evt$: Event) {
    console.log("filterTheList - evt$ ", evt$);
    const value = (evt$.target as HTMLInputElement).value;
    this.data_source.filter = value.trim().toLowerCase();
    if (this.data_source.paginator) {
      this.data_source.paginator.firstPage();
    }
  }
}
