import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { SessionService } from '../app/services/session.service';
import { ValidationType } from './components/input-field/input-field.component';
import { Session } from './Session';
import { getSHA256Hash } from './utils';

const UsernameValidation = z.coerce
  .string({
    required_error: 'Username is required',
  })
  .trim()
  .min(5, { message: 'Must be 5 or more characters long' })
  .max(60, { message: 'Must be 60 or fewer characters long' });

const PasswordValidation = z
  .string({
    required_error: 'Password is required',
  })
  .trim()
  .min(5, { message: 'Must be 5 or more characters long' })
  .max(60, { message: 'Must be 60 or fewer characters long' });

const SessionValidation = z.object({
  username: UsernameValidation,
  password: PasswordValidation,
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private sessionService: SessionService,
    private cookieService: CookieService
  ) {}

  isLoggedIn: boolean = false;
  isLoggingIn: boolean = false;
  username: string = '';
  usernameValidationIcon: string = '';
  usernameValidationText: string = '';
  usernameValidationType: ValidationType = 'default';
  password: string = '';
  passwordValidationIcon: string = '';
  passwordValidationText: string = '';
  passwordValidationType: ValidationType = 'default';
  loadError: string = '';
  submitError: string = '';

  ngOnInit() {
    // Check logged in status
    this.sessionService.getSessions().subscribe({
      next: (sessions) => {
        const currentSession = this.findSessionCookies(sessions);
        if (currentSession) {
          this.setSessionCookies(currentSession);
        }
        this.isLoggedIn = !!currentSession;
      },
      error: (error) => {
        this.loadError = error.message;
      },
    });
    // error handling
  }

  setSessionCookies(session: Session) {
    this.cookieService.set('userId', session.userId);
    this.cookieService.set('sessionToken', session.sessionToken);
  }

  findSessionCookies(sessions: Session[]) {
    return sessions.find(
      (session) =>
        session.userId === this.cookieService.get('userId') &&
        session.sessionToken === this.cookieService.get('sessionToken')
    );
  }

  resetValidation(inputName: string | number) {
    switch (inputName) {
      case 'username':
        this.usernameValidationIcon = '';
        this.usernameValidationText = '';
        this.usernameValidationType = 'default';
        break;
      case 'password':
        this.passwordValidationIcon = '';
        this.passwordValidationText = '';
        this.passwordValidationType = 'default';
        break;
      default:
        break;
    }
  }

  setValidation(
    inputName: string | number,
    type: ValidationType,
    icon: string,
    text: string
  ) {
    switch (inputName) {
      case 'username':
        this.usernameValidationIcon = icon;
        this.usernameValidationText = text;
        this.usernameValidationType = type;
        break;
      case 'password':
        this.passwordValidationIcon = icon;
        this.passwordValidationText = text;
        this.passwordValidationType = type;
        break;
      default:
        break;
    }
  }

  // Validate user input on change (on blur)
  onInputChange(input: HTMLInputElement) {
    switch (input.name) {
      case 'username':
        this.username = input.value;
        try {
          UsernameValidation.parse(input.value);
          this.setValidation(
            'username',
            'success',
            'check-badge',
            `${input.value} is available.`
          );
        } catch (error) {
          if (error instanceof z.ZodError) {
            this.setValidation(
              'username',
              'error',
              'x-mark',
              error.issues[0].message
            );
          }
        }
        break;
      case 'password':
        this.password = input.value;
        try {
          PasswordValidation.parse(input.value);
          this.resetValidation('password');
        } catch (error) {
          if (error instanceof z.ZodError) {
            this.setValidation(
              'password',
              'error',
              'x-mark',
              error.issues[0].message
            );
          }
        }
        break;
      default:
        break;
    }
  }

  async onSubmit() {
    this.isLoggingIn = true;
    this.loadError = '';
    this.submitError = '';

    // Validate username and password
    try {
      SessionValidation.parse({
        username: this.username,
        password: this.password,
      });
      this.resetValidation('username');
      this.resetValidation('password');

      // Generate and set session in cookie and db
      const session = {
        userId: await getSHA256Hash(this.username),
        sessionToken: uuidv4(),
      };
      this.setSessionCookies(session);
      setTimeout(() => {
        this.sessionService.setSession(session).subscribe({
          next: async () => {
            this.isLoggedIn = true;
            this.username = '';
            this.password = '';
            this.isLoggingIn = false;
          },
          error: (error) => {
            this.submitError = error.message;
            this.isLoggingIn = false;
          },
        });
      }, 1000); // Simulate delay
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          this.setValidation(issue.path[0], 'error', 'x-mark', issue.message);
        });
      }
      this.isLoggingIn = false;
    }
  }

  onLogOut() {
    this.cookieService.delete('userId');
    this.cookieService.delete('sessionToken');
    this.isLoggedIn = false;
  }
}
