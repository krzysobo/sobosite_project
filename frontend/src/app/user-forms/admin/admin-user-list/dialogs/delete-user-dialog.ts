import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogClose } from "@angular/material/dialog";


@Component({
    selector: 'delete-user-dialog',
    styleUrl: './delete-user-dialog.scss',
    templateUrl: 'delete-user-dialog.html',
    standalone: false,
    // imports: [MatButtonModule, MatDialogActions, MatDialogContent, MatDialogClose], // moved to module
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class DeleteUserDialog implements OnInit{  
    readonly dialogRef = inject(MatDialogRef<DeleteUserDialog>);
    @Output() confirm_clicked = new EventEmitter<any>();

    @Output() confirmed: boolean = false;
    public first_name: string = "";
    public last_name: string = "";
    public email: string = "";

    constructor(
            @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit(){
        this.first_name = this.data.first_name;
        this.last_name = this.data.last_name;
        this.email = this.data.email;
        console.log("ABC");
    }

    confirm() {
        this.confirmed = true;
        // true is just a sample data; you can emit for example form data, etc,
        // though they may also be read from the response in afterClosed()
        this.confirm_clicked.emit(this.confirmed);
    }
  }
  