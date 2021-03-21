import { HttpClient } from '@angular/common/http';
import { ResourceLoader } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
interface DataTablesResponse {
  data: any[];
  draw: number;
  to: number;
  total: number;
}


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  products: any = [];


  addForm = this.fb.group({
    id: [''],
    reference: [''],
    dbrandption: [''],
    brand: [''],
    qty: ['']



  });

  editForm = this.fb.group({
    id: [''],
    reference: [''],
    dbrandption: [''],
    brand: [''],
    qty: ['']


  });


  deleteForm = this.fb.group({
    id: [''],


  });

  table: string = 'show';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {this.LoadTable();
  }


LoadTable(): void{

  const that = this;

  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 5,
    serverSide: true,
    processing: true,
    ajax: (dataTablesParameters: any, callback) => {
      that.http
        .post<DataTablesResponse>(
          'http://127.0.0.1:8000/api/datatable_product',
          dataTablesParameters, {}
        ).subscribe(resp => {
          that.products = resp.data;

          callback({
            recordsTotal: resp.to,
            recordsFiltered: resp.total,
            data: []
          });
        });
    },
    columns: [
      { data: 'id' },
      { data: 'reference' },
      { data: 'description' },
      { data: 'brand' },
      { data: 'qty' },

    ]
  };
}

  addSubmit(): void {
    console.log(this.addForm.value)
    this.http.post('http://127.0.0.1:8000/api/insert_Product', this.addForm.value)
    .subscribe(
      (res) => {
        window.location.reload();

      }
    );
  }

  editSubmit(): void {
    console.log(this.editForm.value)
    this.http.put('http://127.0.0.1:8000/api/edit_Product/' + this.editForm.value.id, this.editForm.value)

      .subscribe(
        (res) => {
          window.location.reload();

        }
      );

  }


  deleteSubmit(): void {
    console.log(this.deleteForm.value)
    this.http.delete('http://127.0.0.1:8000/api/delete_Product/' + this.deleteForm.value.id,)
      .subscribe(
        (res) => {
          console.log(res);

        }
      );

  }
  showProduct(product: any): void {
    console.log(product);

  }
  deleteProduct(product: any): void {
    this.http.delete('http://127.0.0.1:8000/api/delete_Product/' + product.id)
      .subscribe(
        (res) => {
          window.location.reload();
          console.log(res);
          this.LoadTable();

        }
      );
  }
  changeProduct(product: any): void {
  this.table = 'edit';
  this.editForm = this.fb.group({
    id: [product.id],
    reference: [product.reference],
    description: [product.description],
    brand: [product.brand],
    qty: [product.qty],
  })

}

addProduct(product: any): void {
  this.table = 'add';
  this.addForm = this.fb.group({
    reference: [product.reference],
    description: [product.description],
    brand: [product.brand],
    qty: [product.qty],
  })



  }

}

