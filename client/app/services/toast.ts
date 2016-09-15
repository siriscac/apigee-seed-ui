import {Injectable} from '@angular/core';

@Injectable()
export class ToastService {

    constructor() {

    }

    showToast(msg: string) {
        var snackbarContainer: any = document.querySelector('#toast');
        snackbarContainer.MaterialSnackbar.showSnackbar({message: msg});
    }
}
