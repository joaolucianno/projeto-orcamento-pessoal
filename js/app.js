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
    };
    //Methods
    proximoId(){
        let id = localStorage.getItem('id');
        return parseInt(id) + 1
    }
    
    gravar(d){
        let id = this.proximoId();
        localStorage.setItem('id', this.proximoId());
        localStorage.setItem(id, JSON.stringify(d));
    }
    recuperarTodasDespesas(){
        let despesas = Array();
        let id = localStorage.getItem('id');
        for(let i = 1; i <= id; i++){
            let desp = JSON.parse(localStorage.getItem(i))
            if(desp === null){
                continue;
            } else{
                desp.id = i
                despesas.push(desp)
            }
        }
        console.log(despesas);
        return despesas
    };
    remover(id){
        localStorage.removeItem(id);
        console.log(id);
    };
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
        db.gravar(despesa);
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
};



function mostrarDespesas(){
    let despesas = db.recuperarTodasDespesas();
    //console.log(despesas);
    let listaDespesas = document.getElementById('listaDespesas')
    
    despesas.forEach(function(d){
        let id = d['id'];
        let linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;
        let btn = document.createElement('button');
        btn.className='btn btn-danger btn-sm d-flex align-self-center';
        btn.innerHTML='<i class="fa fa-times"></i>'
        btn.id=`btnRemove${id}`
        btn.onclick= function(){
            db.remover(btn.id.replace('btnRemove', ''));
            window.location.reload();
        };
        linha.insertCell(4).appendChild(btn);
    });
    
};