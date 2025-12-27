import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '#app/services/login/login.service';
import { UserService } from '#app/services/user/user.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  // Toggle between 'login' and 'register' modes
  authMode: 'login' | 'register' = 'login';

  // Form fields
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  rememberMe = true;

  // Current language
  currentLanguage = 'en';

  // Translated error strings
  private loginErrorString = '';
  private signupErrorString = '';
  private signupSuccessString = '';
  private existingUserError = '';
  private invalidPasswordError = '';

  constructor(
    private translateService: TranslateService,
    private loginService: LoginService,
    private userService: UserService,
    private toastController: ToastController,
    private navController: NavController,
  ) {}

  async ngOnInit() {
    // Load saved language preference
    const { value } = await Preferences.get({ key: 'language' });
    if (value) {
      this.currentLanguage = value;
      this.translateService.use(value);
    }

    // Load translation strings
    this.translateService
      .get(['LOGIN_ERROR', 'SIGNUP_ERROR', 'SIGNUP_SUCCESS', 'EXISTING_USER_ERROR', 'INVALID_PASSWORD_ERROR'])
      .subscribe(values => {
        this.loginErrorString = values.LOGIN_ERROR;
        this.signupErrorString = values.SIGNUP_ERROR;
        this.signupSuccessString = values.SIGNUP_SUCCESS;
        this.existingUserError = values.EXISTING_USER_ERROR;
        this.invalidPasswordError = values.INVALID_PASSWORD_ERROR;
      });
  }

  toggleAuthMode() {
    this.authMode = this.authMode === 'login' ? 'register' : 'login';
    // Clear password when switching modes for security
    this.password = '';
  }

  async toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'es' : 'en';
    this.translateService.use(this.currentLanguage);
    await Preferences.set({ key: 'language', value: this.currentLanguage });
  }

  async doLogin() {
    const credentials = {
      username: this.email,
      password: this.password,
      rememberMe: this.rememberMe,
    };

    try {
      await this.loginService.login(credentials);
      this.navController.navigateRoot('/tabs/home');
    } catch (err) {
      // Unable to log in
      this.password = '';
      const toast = await this.toastController.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      toast.present();
    }
  }

  async doSignup() {
    const accountInfo = {
      login: this.email,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      langKey: this.currentLanguage,
    };

    this.userService.signup(accountInfo).subscribe(
      async () => {
        // Success - now auto-login
        const toast = await this.toastController.create({
          message: this.signupSuccessString,
          duration: 2000,
          position: 'top',
          color: 'success',
        });
        toast.present();

        // Auto-login after successful registration
        setTimeout(() => {
          this.autoLoginAfterSignup();
        }, 500);
      },
      async response => {
        // Unable to sign up
        const error = JSON.parse(response.error);
        let displayError = this.signupErrorString;

        if (response.status === 400 && error.type?.includes('already-used')) {
          displayError = this.existingUserError;
        } else if (
          response.status === 400 &&
          error.message === 'error.validation' &&
          error.fieldErrors?.[0]?.field === 'password' &&
          error.fieldErrors[0].message === 'Size'
        ) {
          displayError = this.invalidPasswordError;
        }

        const toast = await this.toastController.create({
          message: displayError,
          duration: 3000,
          position: 'top',
          color: 'danger',
        });
        toast.present();
      },
    );
  }

  private async autoLoginAfterSignup() {
    const credentials = {
      username: this.email,
      password: this.password,
      rememberMe: true,
    };

    try {
      await this.loginService.login(credentials);
      this.navController.navigateRoot('/tabs/home');
    } catch (err) {
      // Auto-login failed, switch to login mode
      this.authMode = 'login';
      const toast = await this.toastController.create({
        message: 'Account created. Please log in.',
        duration: 3000,
        position: 'top',
        color: 'warning',
      });
      toast.present();
    }
  }

  onSubmit() {
    if (this.authMode === 'login') {
      this.doLogin();
    } else {
      this.doSignup();
    }
  }
}
