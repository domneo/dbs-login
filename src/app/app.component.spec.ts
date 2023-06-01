import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from './services/session.service';
import { AppComponent } from './app.component';
import * as utils from './utils';

jest.useFakeTimers();

const mockSessions = [
  {
    userId: 'd9b6343d416baa08230701b9732adb3ef394c17834042b9ad32203f1354ddc12',
    sessionToken: '9035bef0-fc2f-4f37-982c-7afa16b4923c',
    id: 1,
  },
];
class CookieServiceMock {
  set = jest.fn();
  get = jest.fn().mockImplementation((cookieName: string) => {
    switch (cookieName) {
      case 'userId':
        return mockSessions[0].userId;
      case 'sessionToken':
        return mockSessions[0].sessionToken;
      default:
        return null;
    }
  });
  delete = jest.fn();
}

describe('AppComponent', () => {
  let httpMock: HttpTestingController;
  let cookieService: CookieService;
  let sessionService: SessionService;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    jest.spyOn(utils, 'getSHA256Hash').mockResolvedValue('hashedvalue');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CookieService, useClass: CookieServiceMock },
        SessionService,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService);
    sessionService = TestBed.inject(SessionService);

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should check login status on init', async () => {
    component.ngOnInit();

    const req = httpMock.expectOne(`http://localhost:3000/sessions`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
    expect(cookieService.set).toHaveBeenCalledTimes(2);
  });

  test('should update input values and validate on change', async () => {
    component.onInputChange({ name: 'username', value: 'abc123' });
    component.onInputChange({ name: 'password', value: 'def456' });

    expect(component.username).toEqual('abc123');
    expect(component.password).toEqual('def456');
    expect(component.usernameValidationIcon).toEqual('check-badge');
    expect(component.usernameValidationText).toEqual('abc123 is available.');
    expect(component.usernameValidationType).toEqual('success');
  });

  test('should throw validation error if input values do not meet requirements', async () => {
    component.onInputChange({ name: 'username', value: 'abc' });
    component.onInputChange({ name: 'password', value: 'def' });

    expect(component.usernameValidationIcon).toEqual('x-mark');
    expect(component.usernameValidationText).toEqual(
      'Must be 5 or more characters long'
    );
    expect(component.usernameValidationType).toEqual('error');
    expect(component.passwordValidationIcon).toEqual('x-mark');
    expect(component.passwordValidationText).toEqual(
      'Must be 5 or more characters long'
    );
    expect(component.passwordValidationType).toEqual('error');
  });

  test('should be able to pass validation on submit', () => {
    component.onInputChange({ name: 'username', value: 'abc123' });
    component.onInputChange({ name: 'password', value: 'def456' });
    component.onSubmit();

    expect(component.usernameValidationIcon).toEqual('');
    expect(component.usernameValidationText).toEqual('');
    expect(component.usernameValidationType).toEqual('default');
    expect(component.passwordValidationIcon).toEqual('');
    expect(component.passwordValidationText).toEqual('');
    expect(component.passwordValidationType).toEqual('default');
  });

  test('should be able to fail validation on submit', () => {
    component.onInputChange({ name: 'username', value: 'abc' });
    component.onInputChange({ name: 'password', value: 'def' });
    component.onSubmit();

    expect(component.usernameValidationIcon).toEqual('x-mark');
    expect(component.usernameValidationText).toEqual(
      'Must be 5 or more characters long'
    );
    expect(component.usernameValidationType).toEqual('error');
    expect(component.passwordValidationIcon).toEqual('x-mark');
    expect(component.passwordValidationText).toEqual(
      'Must be 5 or more characters long'
    );
    expect(component.passwordValidationType).toEqual('error');
  });

  test('should clear cookies on log out', async () => {
    component.onLogOut();

    expect(cookieService.delete).toHaveBeenCalledTimes(2);
    expect(component.isLoggedIn).toEqual(false);
  });
});
