jalar_data()


comboselect(null, base_url+'Categorias/list_categorias','Tipo de categoria', 'item.ide_categoria','item.nom_cat', 'form1','inp_text3')

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
  modalData(idr)
  $('#myModalver').modal('show')
})

$('#datatable-table').on('click','.edi_registro',function(e) {
  e.preventDefault()
  var idr = $(this).attr('idr')
  modalData(idr)
  $('#accion').val('editar')
  $('#title').html('Editar')
  $('#myModaledita').modal('show')
})
$('#datatable-table').on('click','.bor_registro',function(e) {
  e.preventDefault()
  var idr = $(this).attr('idr')
  modalData(idr)
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

function modalData(idr) {

  $.post(base_url+ `fianza/get_fia/${idr}`,function(data) {
    var detalle = '';
    var id_cat = '';
    $.each(data,function (i,item) {
      $("#inp_text1").val(item.ide_fianza)
      $("#inp_text2").val(item.nom_cat)
    id_cat = item.ide_categoria

      comboselect(id_cat, base_url+'Categorias/list_categorias','Tipo de categoria', 'item.ide_categoria','item.nom_cat', 'form1','inp_text3')


      detalle += `
      <tr><th>Nombre:</th><td>${item.nom_fia}</td></tr>
      <tr><th>Categoria:</th><td>${item.nom_cat}</td></tr>

      `;
    })

    $('#detalle_registro').html(detalle)

  })
}

  function jalar_data() {
    datatable = ''
    $.getJSON(base_url+'Fianza/list_fianzas', function(data){
      $.each(data, function (i,item) {
        datatable += `
        <tr>
          <td>${item.nom_fia}</td>
          <td>${item.nom_cat}</td>
          <td class="ver_registro" idr="${item.ide_fianza}" ><i class="fa fa-search"></i> </td>
          <td class="edi_registro" idr="${item.ide_fianza}"><i class="fa fa-pencil"></i> </td>
          <td class="bor_registro" idr="${item.ide_fianza}"><i class="fa fa-trash-o"></i> </td>
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
    url:`${base_url}/Fianza/${destino}`,
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