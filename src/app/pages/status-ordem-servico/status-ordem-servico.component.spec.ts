import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusOrdemServicoComponent } from './status-ordem-servico.component';

describe('StatusOrdemServicoComponent', () => {
  let component: StatusOrdemServicoComponent;
  let fixture: ComponentFixture<StatusOrdemServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusOrdemServicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusOrdemServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
