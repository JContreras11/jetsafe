jalar_data()




$("#btnNuevo").click(function () {
  $('input').val('')
  $("select").val('')
  $("#accion").val('nuevo')

  $("#myModaledita").modal('show')
  $("#title").html('Nuevo')
})

$("#form1").on('submit',function(e) {
  e.preventDefault()
  e.stopImmediatePropagation()
  modalSentData()
})

$('#datatable-table').on('click','.ver_registro',function(e) {
  e.preventDefault()

  var idr = $(this).attr('idr')
  $('#title').html('Ver')
  modalData(idr,'ver_registro')
  $('#myModalver').modal('show')
})

$('#datatable-table').on('click','.edi_registro',function(e) {
  e.preventDefault()
  var idr = $(this).attr('idr')
  modalData(idr,'edi_registro')
  $('#accion').val('editar')
  $('#title').html('Editar')
  $('#myModaledita').modal('show')
})
$('#datatable-table').on('click','.bor_registro',function(e) {
  e.preventDefault()
  var idr = $(this).attr('idr')
  modalData(idr,'bor_registro')
  $('#accion').val('borrar')
  Swal.fire({
  title: 'Estas seguro?',
  text: "No podras obtener este dato de nuevo",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, borrar!'
  }).then((result) => {
    if (result.value) {
      modalSentData()
    }
  })
})




function modalData(idr,type) {

  $.post(base_url+ `empresa/list_emp/${idr}`,function(data) {

            var detalle = '';
            var id_cat = '';

            switch (type) {
              case 'ver_registro':
              $.each(data,function (i,item) {
                detalle += `
                <tr><th>Codigo de afiliacion:</th><td>${item.codigo_afiliacion}</td></tr>
                <tr><th>RUC:</th><td>${item.ruc}</td></tr>
                <tr><th>Razon Social:</th><td>${item.razon_social}</td></tr>
                <tr><th>Nombre Comercial:</th><td>${item.nombre_comercial}</td></tr>
                <tr><th>Email:</th><td>${item.email}</td></tr>
                <tr><th>Web:</th><td>${item.web}</td></tr>
                `;
              })
              $('#detalle_registro').html(detalle)

                break;
              case 'edi_registro':
              $('#webb').css('display','block')
              $.each(data,function (i,item) {
                $("#inp_text1").val(item.empresaid)

                $("#inp_text2").val(item.codigo_afiliacion)
                $("#inp_text3").val(item.ruc)
                $("#inp_text4").val(item.razon_social)
                $("#inp_text5").val(item.nombre_comercial)
                $("#inp_text6").val(item.email)
                $("#inp_text7").val(item.web)


              })

              case 'bor_registro':
                $.each(data,function (i,item) {
                  $("#inp_text1").val(item.empresaid)
                })
                break;
              default:

            }

          })


}



  function jalar_data() {
    datatable = ''
    $.getJSON(base_url+'empresa/list_emp', function(data){
      $.each(data, function (i,item) {
        datatable += `
        <tr>
          <td>${item.razon_social}</td>
          <td>${item.ruc}</td>
          <td>${item.email}</td>
          <td class="ver_registro" idr="${item.empresaid}" ><i class="fa fa-search"></i> </td>
          <td class="edi_registro" idr="${item.empresaid}"><i class="fa fa-pencil"></i> </td>
          <td class="bor_registro" idr="${item.empresaid}"><i class="fa fa-trash-o"></i> </td>
        </tr>
                    `;

      })
      $("#grillaDatos").html(datatable);
      $('#datatable-table').DataTable({
        responsive: true,
        oLanguage:{
          sSearch: 'Buscar:'
        }
      })
    })
  }

function modal_Data(destino) {

}

function modalSentData() {
let accion = $("#accion").val()
  switch (accion) {
    case 'nuevo':
    var destino = 'ins'

    break;
    case 'editar':
    var destino = 'upd'

    break;
    case 'borrar':
    var destino = 'del'

    break;

  }
  $.ajax({
    url:`${base_url}/empresa/${destino}`,
    data : $('#form1').serialize(),
    type: 'POST',
    success:function(data){
      $("#datatable-table").DataTable().destroy()
      jalar_data();
      $("#myModaledita").modal("hide");

    },
    error:function(data) {
      alert('Error!','Hubo un error en el proceso','error')
    }
  })
}
