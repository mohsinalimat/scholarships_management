<html lang="en">

<head>
  <style>
    header.masterhead {
      position: relative;
      background-color: #343a40;
      background: url("/files/webimg/bg.jpg") no-repeat center center;
      background-size: cover;
      padding-top: 8rem;
      padding-bottom: 10rem;
    }

    header.masterhead h2,
    header.masterhead .h2 {
      background-color: rgb(0, 0, 0);
      /* Fallback color */
      background-color: rgba(0, 0, 0, 0.4);
      /* Black w/opacity/see-through */
      color: white;
      font-weight: bold;
      border: 3px solid #f1f1f1;
      position: absolute;
      /*top: 50%;
      left: 50%;*/
      transform: translate(-50%, -50%);
      z-index: 2;
      /*width: 80%;*/
      padding: 20px;
      text-align: center;
    }
  </style>
</head>

<body>
  <header class="masterhead">
    <div class="container position-relative">
      <div class="row justify-content-center">
        <div class='text-center'>
          <h2 class="mb-5">CDAFRICIA</h2> 
          <h2 class="mb-5">لجنة الدعوة في أفريقيا</h2>
        </div>
      </div>
    </div>
  </header>

  <section>
    <div class="container p-0">
      <div class="row g-0">
        <div class="justify-content-center">
          <h4>Dear <u>{{ doc.full_name_en }}</u>, Your Scholarship Request submitted successfully!!</h4>
          <h5>Your Scholarship Request ID: {{ doc.name }} </h5>
        </div>
      </div>
    </div>
  </section>
</body>

</html>