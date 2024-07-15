import { TestBed } from '@angular/core/testing';

import { GlobalfunctionsService } from './globalfunctions.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

describe('GlobalfunctionsService', () => {
  let service: GlobalfunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalfunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //create a unittest for getWeekNumber
  it('should return the correct week number', () => {
    let date = new Date('2021-01-01');
    expect(service.getWeekNumber(date)).toBe(1);
  });
});

fdescribe('GlobalfunctionsService', () => {
  let service: GlobalfunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [MatDialog]
    });
    service = TestBed.inject(GlobalfunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //create a unittest for getWeekNumber
  it('1 january 2021 -> week 1', () => {
    let date = new Date('2024-01-01');
    expect(service.getWeekNumber(date)).toBe(1);
  });

  it('12 july 2024 -> week 28', () => {
    let date = new Date('2024-07-12');
    expect(service.getWeekNumber(date)).toBe(28);
  });

  it('13 july 2024 -> week 28', () => {
    let date = new Date('2024-07-13');
    expect(service.getWeekNumber(date)).toBe(28);
  });

  it('14 july 2024 -> week 29', () => {
    let date = new Date('2024-07-14');
    expect(service.getWeekNumber(date)).toBe(29);
  });

  it('15 july 2024 -> week 29', () => {
    let date = new Date('2024-07-15');
    expect(service.getWeekNumber(date)).toBe(29);
  });

  it('16 july 2024 -> week 29', () => {
    let date = new Date('2024-07-16');
    expect(service.getWeekNumber(date)).toBe(29);
  });

  it('17 july 2024 -> week 29', () => {
    let date = new Date('2024-07-17');
    expect(service.getWeekNumber(date)).toBe(29);
  });

  it('18 july 2024 -> week 29', () => {
    let date = new Date('2024-07-18');
    expect(service.getWeekNumber(date)).toBe(29);
  });

  it('19 july 2024 -> week 29', () => {
    let date = new Date('2024-07-19');
    expect(service.getWeekNumber(date)).toBe(29);
  });

  it('20 july 2024 -> week 29', () => {
    let date = new Date('2024-07-20');
    expect(service.getWeekNumber(date)).toBe(29);
  });

  it('21 july 2024 -> week 30', () => {
    let date = new Date('2024-07-21');
    expect(service.getWeekNumber(date)).toBe(30);
  });

  it('22 july 2024 -> week 30', () => {
    let date = new Date('2024-07-22');
    expect(service.getWeekNumber(date)).toBe(30);
  });

  it('23 july 2024 -> week 30', () => {
    let date = new Date('2024-07-23');
    expect(service.getWeekNumber(date)).toBe(30);
  });
});
