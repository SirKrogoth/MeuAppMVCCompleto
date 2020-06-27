function AjaxModal() {
    $(document).ready(function () {
        $(function () {
            $.ajaxSetup({ cache: false });

            $("a[data-modal]").on("click",
                function (e) {
                    $('#myModalContent').load(this.href,
                        function () {
                            $('#myModal').modal({
                                keyboard: true
                            },
                                'show');
                            bindform(this);
                        });
                    return false;
                });
        });
    

        function bindform(dialog) {
            $('form', dialog).submit(function () {
                $.ajax({
                    url: this.action,
                    type: this.method,
                    data: $(this).serialize(),
                    success: function (result) {
                        if (result.success) {
                            $('#myModal').modal('hide');
                            $('#EnderecoTarget').load(result.url);
                        } else {
                            $('#myModalContent').html(result);
                            bindForm(dialog);
                        }
                    }
                });
                return false;
            });
        }
    });
}

function BuscarCep() {
    $(document).ready(function () {
        //Limpa valores do formulário cep.
        $("#Endereco_Logradouro").val("");
        $("#Endereco_Bairro").val("");
        $("#Endereco_Cidade").val("");
        $("#Endereco_Estado").val("");

        //Quando o cep perde o foco
        $('#Endereco_Cep').blur(function () {
            //Nova varável cep somente com dígitos.
            var cep = $(this).val().replace(/\D/g, '');

            //verifica se o campo cep possui valor.
            if (cep != "") {
                //Expressao regular para valiar o CEP
                var validacep = /^[0-9]{8}$/;

                //Validar formato do cep
                if (validacep.test(cep)) {
                    //Preencher os campos com
                    $("#Endereco_Logradouro").val("...");
                    $("#Endereco_Bairro").val("...");
                    $("#Endereco_Cidade").val("...");
                    $("#Endereco_Estado").val("...");

                    //Consulta API
                    $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?",
                        function (dados) {
                            if (!("erro" in dados)) {
                                //Atualiza vampos
                                $("#Endereco_Logradouro").val(dados.logradouro);
                                $("#Endereco_Bairro").val(dados.bairro);
                                $("#Endereco_Cidade").val(dados.localidade);
                                $("#Endereco_Estado").val(dados.uf);
                            }
                            else {
                                limpa_formulario_cep();
                                alert("CEP não encontrado");
                            }
                        });
                }//end if
                else {
                    //cep inválido
                    limpa_formulario_cep();
                    alert("Formato de CEP Inválido.");
                }
            }
            else {
                limpa_formulario_cep();
            }
        });
    });
}