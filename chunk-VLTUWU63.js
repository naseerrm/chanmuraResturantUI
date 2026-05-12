import{a as $}from"./chunk-DRADDOH3.js";import{a as U}from"./chunk-GYITEGRS.js";import{a as V,b as z,e as F,g as k,h as L,i as R,j as W,l as q,m as j,n as Q}from"./chunk-MSKK4R5H.js";import{f as D}from"./chunk-W2ISYDOZ.js";import{Db as N,Ga as u,Ma as O,Qa as C,Rb as A,Sb as B,W as f,X as y,Xa as c,Ya as e,Za as n,_a as x,_b as T,aa as w,bb as M,cb as E,db as p,ea as I,lb as i,mb as v,nb as s,pb as g,qb as b,rb as h,ua as P,ya as l}from"./chunk-O5FEPKU6.js";import{a as _,b as S}from"./chunk-KAT7YFEL.js";function H(m,o){if(m&1&&(e(0,"tr")(1,"td"),i(2),n(),e(3,"td"),i(4),n(),e(5,"td"),i(6),n(),e(7,"td"),i(8),n()()),m&2){let t=o.$implicit;l(2),v(t.menuItem.name),l(2),v(t.quantity),l(2),s("\u20B9",t.menuItem.price),l(2),s("\u20B9",t.menuItem.price*t.quantity)}}function Y(m,o){if(m&1&&(e(0,"div",27),x(1,"img",28),e(2,"p",29),i(3,"Scan to Pay (UPI)"),n()()),m&2){let t=p();l(),c("src",t.upiQrCode,P)}}function J(m,o){if(m&1){let t=M();e(0,"div",30)(1,"label"),i(2,"Purchaser Name:"),n(),e(3,"input",31),h("ngModelChange",function(a){f(t);let d=p();return b(d.purchaserName,a)||(d.purchaserName=a),y(a)}),n(),e(4,"label"),i(5,"Mobile Number:"),n(),e(6,"input",32),h("ngModelChange",function(a){f(t);let d=p();return b(d.mobileNumber,a)||(d.mobileNumber=a),y(a)}),n()()}if(m&2){let t=p();l(3),g("ngModel",t.purchaserName),l(3),g("ngModel",t.mobileNumber)}}function K(m,o){if(m&1){let t=M();e(0,"div",17)(1,"label",33),i(2,"Amount Received"),n(),e(3,"input",34),h("ngModelChange",function(a){f(t);let d=p();return b(d.paidAmount,a)||(d.paidAmount=a),y(a)}),n()()}if(m&2){let t=p();l(3),g("ngModel",t.paidAmount)}}var G=class m{constructor(o,t,r,a){this.firebaseService=o;this.cartService=t;this.router=r;this.cdr=a}cartItems=[];upiQrCode=null;orderConfirmed=new w;purchaserName="";mobileNumber="";paymentMethod="Cash";paidAmount=0;loading=I(!1);subtotal=0;cgst=0;sgst=0;grandTotal=0;billNo="";ngAfterViewInit(){this.cdr.detectChanges()}checkout(){if(this.cartItems.length===0){alert("Your cart is empty!");return}console.log(this.cartItems),this.generateBillNumber(),this.calculateBill(),this.showModal()}calculateBill(){this.subtotal=this.cartItems.reduce((o,t)=>o+t.menuItem.price*t.quantity,0),this.cgst=+(this.subtotal*.025).toFixed(2),this.sgst=+(this.subtotal*.025).toFixed(2),this.grandTotal=+(this.subtotal+this.cgst+this.sgst).toFixed(2)}generateBillNumber(){this.billNo="BILL-"+Date.now()}showModal(){let o=document.getElementById("billModal");o&&new bootstrap.Modal(o).show()}async confirmOrder(){if(!this.cartItems.length)return alert("Cart is empty!");if(!this.purchaserName?.trim()||!this.mobileNumber?.toString().trim())return alert("Enter customer name and mobile number!");if(!this.paymentMethod)return alert("Select payment method!");if(this.paidAmount<=0&&this.paymentMethod=="Cash")return alert("Enter amount received!");this.loading.set(!0);let o={customerName:this.purchaserName,mobileNumber:this.mobileNumber,items:this.cartItems.map(t=>({id:t.menuItem.id,name:t.menuItem.name,price:t.menuItem.price,quantity:t.quantity,totalPrice:t.menuItem.price*t.quantity})),subtotal:this.subtotal,cgst:this.cgst,sgst:this.sgst,totalAmount:this.paymentMethod=="Cash"?Math.round(this.grandTotal):this.grandTotal,paymentMethod:this.paymentMethod,paidAmount:this.paymentMethod=="Cash"?Math.round(this.paidAmount):this.paidAmount,balanceAmount:this.paymentMethod=="Cash"?Math.round(this.paidAmount)-Math.round(this.grandTotal):this.paidAmount-this.grandTotal,DateTime:new Date().toLocaleString()};try{let{orderId:t,docId:r}=await this.firebaseService.placeOrderAtomic(o);alert(`Order placed \u2014 Order #${t}`),document.body.classList.remove("modal-open"),document.querySelectorAll(".modal-backdrop").forEach(d=>d.remove());let a=S(_({},o),{orderId:t,createdAt:new Date().toLocaleString()});this.printInvoice(a),this.cartService.clearCart(),this.cartService.updateCartCount(),this.router.navigate(["/dashboard/orders"])}catch(t){console.error("placeOrderAtomic failed",t),alert("Failed to place order \u2014 try again")}finally{this.loading.set(!1)}}printInvoice(o){let t=window.open("","_blank","width=600,height=800");if(!t){alert("Failed to open invoice window. Please allow pop-ups for this site.");return}let r=new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}).replace(",","");t.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
  body {
    font-family: "Poppins", sans-serif;
    font-size: 11pt;
    padding: 10px;
    background: #ffffffff; /* soft restaurant yellow */
    color: #000;
    margin: 0;
  }

  .bill-box {
    border: 2px solid #000;
    padding: 12px;
    border-radius: 8px;
    background: #ffffffff;
  }

  h2 {
    font-size: 17pt;
    margin-bottom: 2px;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
  }

  h3 {
    font-size: 14pt;
    margin: 5px 0;
    text-align: center;
  }

  h4 {
    font-size: 13pt;
    margin: 5px 0;
  }

  .center {
    text-align: center;
    font-size: 10pt;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }

  /* Header row */
  th {
    border-bottom: 1px solid #000;
    padding: 6px 4px;
    font-size: 10pt;
    font-weight: 600;
    text-align: left; 
  }

  td {
    padding: 5px 4px;
    font-size: 10pt;
    text-align: left;
  }

  /* Item table rows */
  tbody tr td {
    border-bottom: 1px dashed #aaa;
  }

  /* Compact no-border table */
  .no-border td {
    border: none !important;
    padding: 3px 0;
  }

  /* Total Section */
  .total-box {
    margin-top: 10px;
    padding: 8px;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    font-size: 11pt;
    padding: 3px 0;
  }

  .total-row strong {
    font-weight: 700;
  }

  .grand-total {
    font-size: 13pt;
    font-weight: 700;
    text-align: center;
    margin-top: 6px;
    padding-top: 6px;
    border-top: 2px solid #000;
  }

  /* Footer Message */
  .footer-msg {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px dashed #888;
    text-align: center;
    font-size: 10pt;
    font-weight: 600;
  }

  /* Print Button */
  button {
    padding: 6px 20px;
    font-size: 10pt;
    margin-top: 10px;
    cursor: pointer;
    background: #000;
    color: #fff;
    border-radius: 6px;
    border: none;
  }

  @media print {
    button {
      display: none;
    }
    body {
      background: white;
    }
  }
</style>

      </head>

      <body>
        <div class="bill-box">

          <h2>NAVEEN'S DELHI MALAI CHAAP</h2>
          <div class="center">Thirukovilur Main Rd, Bharathi Nagar, Tiruvennanallur, Tiruvannamalai, Tamil Nadu 606601</div>
          <div class="center">Contact: 74188 89585</div>
          <br/>

          <table class="no-border">
            <tr>
              <td><b>Bill No:</b> ${o.orderId}</td>
              <td><b>Bill Date:</b> ${r}</td>
            </tr>
            <tr>
              <td><b>Customer:</b> ${o.customerName}</td>
              <td><b>Mobile:</b> ${o.mobileNumber}</td>
            </tr>
          </table>

          <br/>

          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Rate</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${o.items.map(a=>`
              <tr>
                <td>${a.name}</td>
                <td>\u20B9${a.price}</td>
                <td>${a.quantity}</td>
                <td>\u20B9${a.totalPrice}</td>
              </tr>
              `).join("")}
            </tbody>
          </table>

          <br/>

          <table class="no-border">
            <tr>
              <td><b>Items:</b> ${o.items.length}</td>
              <td><b>Qty:</b> ${o.items.reduce((a,d)=>a+d.quantity,0)}</td>
              <td><b>Total Amount:</b></td>
              <td><b>\u20B9${o.totalAmount}</b></td>
            </tr>
          </table>

          <h3 style="text-align:center;">Net Amount: \u20B9${o.totalAmount}</h3>

          <br/>

          <div class="footer-msg">
            GOODS SOLD CANNOT BE RETURNED OR REFUNDED<br/>
            Thank You! Visit Again
          </div>

        </div>

        <br/>
        <div class="center">
          <button onclick="window.print()">Print Invoice</button>
        </div>

      </body>
    </html>
  `),t.document.close()}static \u0275fac=function(t){return new(t||m)(u(U),u($),u(D),u(N))};static \u0275cmp=O({type:m,selectors:[["app-bill-summary"]],inputs:{cartItems:"cartItems",upiQrCode:"upiQrCode"},outputs:{orderConfirmed:"orderConfirmed"},decls:62,vars:11,consts:[["id","billModal","tabindex","-1",1,"modal","fade"],[1,"modal-dialog","modal-lg","modal-dialog-centered"],[1,"modal-content"],[1,"modal-header","bg-dark","text-white"],[1,"modal-title"],[1,"bi","bi-receipt"],["type","button","data-bs-dismiss","modal",1,"btn-close","btn-close-white"],[1,"modal-body"],[1,"table-responsive"],[1,"table","table-sm","table-striped","align-middle"],[1,"table-light"],[4,"ngFor","ngForOf"],[1,"bill-summary","mt-3"],[1,"summary-line"],[1,"summary-line","fw-bold","grand-total","mt-2"],["class","text-center mt-4",4,"ngIf"],["class","purchaser-info mt-4",4,"ngIf"],[1,"mb-3"],["for","paymentMethod",1,"form-label"],["id","paymentMethod",1,"form-select",3,"ngModelChange","ngModel"],["value","Cash"],["value","Card"],["value","UPI"],["class","mb-3",4,"ngIf"],[1,"modal-footer"],["data-bs-dismiss","modal",1,"btn","btn-secondary"],[1,"btn","btn-primary",3,"click","disabled"],[1,"text-center","mt-4"],["width","180","height","180",1,"qr-code","img-thumbnail",3,"src"],[1,"small","text-muted","mt-2"],[1,"purchaser-info","mt-4"],["type","text","placeholder","Enter purchaser name",1,"form-control","mb-3",3,"ngModelChange","ngModel"],["type","number","maxlength","10","pattern","[0-9]{10}","placeholder","Enter mobile number",1,"form-control","mb-3",3,"ngModelChange","ngModel"],["for","paidAmount",1,"form-label"],["type","number","id","paidAmount",1,"form-control",3,"ngModelChange","ngModel"]],template:function(t,r){t&1&&(e(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"h5",4),x(5,"i",5),i(6," Bill Summary"),n(),x(7,"button",6),n(),e(8,"div",7)(9,"div",8)(10,"table",9)(11,"thead",10)(12,"tr")(13,"th"),i(14,"Item"),n(),e(15,"th"),i(16,"Qty"),n(),e(17,"th"),i(18,"Price"),n(),e(19,"th"),i(20,"Total"),n()()(),e(21,"tbody"),C(22,H,9,4,"tr",11),n()()(),e(23,"div",12)(24,"div",13)(25,"span"),i(26,"Subtotal"),n(),e(27,"strong"),i(28),n()(),e(29,"div",13)(30,"span"),i(31,"CGST 2.5%"),n(),e(32,"strong"),i(33),n()(),e(34,"div",13)(35,"span"),i(36,"SGST 2.5%"),n(),e(37,"strong"),i(38),n()(),e(39,"div",14)(40,"span"),i(41,"Grand Total"),n(),e(42,"strong"),i(43),n()()(),C(44,Y,4,1,"div",15)(45,J,7,2,"div",16),e(46,"div",17)(47,"label",18),i(48,"Payment Method"),n(),e(49,"select",19),h("ngModelChange",function(d){return b(r.paymentMethod,d)||(r.paymentMethod=d),d}),e(50,"option",20),i(51,"Cash"),n(),e(52,"option",21),i(53,"Card"),n(),e(54,"option",22),i(55,"UPI"),n()()(),C(56,K,4,1,"div",23),n(),e(57,"div",24)(58,"button",25),i(59,"Close"),n(),e(60,"button",26),E("click",function(){return r.confirmOrder()}),i(61),n()()()()()),t&2&&(l(22),c("ngForOf",r.cartItems),l(6),s("\u20B9",r.subtotal),l(5),s("\u20B9",r.cgst),l(5),s("\u20B9",r.sgst),l(5),s("\u20B9",r.grandTotal),l(),c("ngIf",r.upiQrCode),l(),c("ngIf",r.cartItems.length>0),l(4),g("ngModel",r.paymentMethod),l(7),c("ngIf",r.paymentMethod==="Cash"),l(4),c("disabled",r.loading()),l(),s(" ",r.loading()?"Saving...":"Confirm & Print"," "))},dependencies:[T,A,B,Q,R,W,V,k,L,z,q,j,F],styles:["#billModal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]{border-radius:12px;overflow:hidden;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif}#billModal[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]{border-bottom:2px solid #444;font-size:1.1rem}#billModal[_ngcontent-%COMP%]   .modal-title[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{margin-right:8px;font-size:1.2rem}#billModal[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]{margin-bottom:0}#billModal[_ngcontent-%COMP%]   .summary-line[_ngcontent-%COMP%]{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #ddd;font-size:.95rem}#billModal[_ngcontent-%COMP%]   .summary-line.grand-total[_ngcontent-%COMP%]{border-top:2px solid #000;font-size:1.1rem}#billModal[_ngcontent-%COMP%]   .qr-code[_ngcontent-%COMP%]{border-radius:12px}#billModal[_ngcontent-%COMP%]   .purchaser-info[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-weight:500}#billModal[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%], #billModal[_ngcontent-%COMP%]   .form-select[_ngcontent-%COMP%]{border-radius:8px}#billModal[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{border-radius:8px;min-width:140px}#billModal[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]{border-radius:8px;min-width:100px}#billModal[_ngcontent-%COMP%]   .table-striped[_ngcontent-%COMP%] > tbody[_ngcontent-%COMP%] > tr[_ngcontent-%COMP%]:nth-of-type(odd){background-color:#f8f9fa}#billModal[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], #billModal[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{vertical-align:middle}#billModal[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%]{max-height:70vh;overflow-y:auto;padding:1.5rem}"]})};export{G as a};
