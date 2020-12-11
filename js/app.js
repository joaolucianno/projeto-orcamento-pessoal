//Classes
class Despesa{
    //Property
    constructor(dia, mes, ano, tipo, descricao, valor){
        this.dia = dia;
        this.mes = mes;
        this.ano = ano;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    };
    //Methods
    
    validarDados(){
        for (let i in this){
            if(this[i] == undefined || this[i] == null || this[i] == ''){
                return false;
            }
        }
        return true;
    };
}

class DB{
    //Property
    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0);
        }
        //console.log(id)
    }
    //Methods
    proximoId(){
        let id = localStorage.getItem('id');
        let proximoId = parseInt(id) + 1
        localStorage.setItem('id', proximoId);
        //console.log(proximoId);
    }
    
    gravar(d){
        let despesa = JSON.stringify(d);
        this.proximoId()
        let id = localStorage.getItem('id')
        console.log(id);
        localStorage.setItem(id, despesa);
    }
};
//Instância de DB
let db = new DB();


//Functions

function cadastrarDespesa(){
    let dia = document.getElementById('dia').value;
    let mes = document.getElementById('mes').value;
    let ano = document.getElementById('ano').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(dia, mes, ano, tipo, descricao, valor);
    if(despesa.validarDados()){
        //db.gravar(despesa);
        //alert('OK')
        //Mostrar Modal
        $('#exampleModal').modal('show');
        document.getElementById('exampleModalLabel').className='modal-title text-success';
        document.getElementById('exampleModalLabel').innerHTML='Registro inserido com sucesso';
        document.getElementById('bodyModal').innerHTML='Despesa foi cadastrada com sucesso';
        document.getElementById('btnVoltar').className='btn btn-success';
        document.getElementById('btnVoltar').innerHTML='Voltar';
        //Zerar campos após salvar despesa
        document.getElementById('dia').value='0';
        document.getElementById('mes').value='0';
        document.getElementById('ano').value='0';
        document.getElementById('tipo').value='0';
        document.getElementById('descricao').value='';
        document.getElementById('valor').value='';
        
    } else{
        $('#exampleModal').modal('show');
        document.getElementById('exampleModalLabel').className='modal-title text-danger';
        document.getElementById('exampleModalLabel').innerHTML='Erro na inclusão do registro';
        document.getElementById('bodyModal').innerHTML='Verifique se os campos foram preenchidos corretamente';
        document.getElementById('btnVoltar').className='btn btn-danger'
        document.getElementById('btnVoltar').innerHTML='Voltar e corrigir'
        //alert('ERRO')
    }
    console.log(despesa)
}