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
        return despesas
    };
    pesquisar(df, filtro){
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodasDespesas();

        for (let i in df){
            filtrar(i);
        };

        function filtrar(attr){
            if(df[attr] != '0' && df[attr] != ''){
                despesasFiltradas = despesasFiltradas.filter(f => f[attr] == df[attr]);
            }
        };
        mostrarDespesas(despesasFiltradas, filtro);
        ordenarFiltradas = despesasFiltradas;
    }
    remover(id){
        localStorage.removeItem(id);
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
    console.log(valor);
    //
    let despesa = new Despesa(dia, mes, ano, tipo, descricao, valor);
    if(despesa.validarDados()){
        db.gravar(despesa);
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
    }
};

//Filtro
let filtro = false;

function limparFiltros(){
    document.getElementById('dia').value='0';
    document.getElementById('mes').value='0';
    document.getElementById('ano').value='0';
    document.getElementById('tipo').value='0';
    document.getElementById('descricao').value='';
    document.getElementById('valor').value='';
};

function filtrar(){
    let dia = document.getElementById('dia').value;
    let mes = document.getElementById('mes').value;
    let ano = document.getElementById('ano').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;
    //
    let despesasFiltradas = new Despesa(dia, mes, ano, tipo, descricao, valor);
    filtro = true;
    db.pesquisar(despesasFiltradas, filtro);
}

//Mostrar Despesas
function mostrarDespesas(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
        despesas = db.recuperarTodasDespesas();
    }
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML= '';
    //
    let valorTotal = 0;
    let mostrarTotal = false;
    despesas.forEach(function(d){
        let id = d['id'];
        d.valor = parseFloat(d.valor)
        let linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = '€' + (d.valor).toFixed(2);
        let btn = document.createElement('button');
        btn.className='btn btn-danger btn-sm d-flex align-self-center btnFormat';
        btn.innerHTML='<i class="fa fa-times"></i>'
        btn.id=`btnRemove${id}`
        btn.onclick= function(){
            $('#exampleModal').modal('show');
            document.getElementById('exampleModalLabel').className ='modal-title text-danger';
            document.getElementById('exampleModalLabel').innerHTML ='Remover despesa';
            document.getElementById('bodyModal').innerHTML ='Tem certeza que deseja remover esta despesa?';
            document.getElementById('btnSim').className ='btn btn-danger';
            document.getElementById('btnSim').innerHTML ='Sim';
            document.getElementById('btnNao').className ='btn btn-danger';
            document.getElementById('btnNao').innerHTML ='Não';
            document.getElementById('btnSim').onclick = function(){
                db.remover(btn.id.replace('btnRemove', ''));
                window.location.reload();
            }
        };
        linha.insertCell(4).appendChild(btn);
        valorTotal += parseFloat(d.valor);
        mostrarTotal = true;
    });
    if(mostrarTotal == true){
        let total = listaDespesas.insertRow();
        total.insertCell(0).innerHTML = '';
        total.insertCell(1).innerHTML = '';
        total.insertCell(2).innerHTML = `<br><b>Total</b>`;
        total.insertCell(3).innerHTML = `<br>€${valorTotal.toFixed(2)}`;
        total.insertCell(4).innerHTML = '';
        
    }
    
    
};

//Sort
let ordenarFiltradas; //Array com despesas filtradas. Deve ser inserido nas funções abaixo caso (filtro == true)
let ordemData = 0; //Verifica se vai ordenar do mais recente para mais antigo
let ordemTipo = 0;
let ordemValor = 0;

function ordenarData(){
    let list;
    if(filtro == false){
        list = db.recuperarTodasDespesas();
    } else{
        list = ordenarFiltradas;
    }
    //
    if(ordemData % 2 == 0){ 
        list.sort((a, b) => a.dia > b.dia ? -1 : 1);
        list.sort((a, b) => a.mes > b.mes ? -1 : 1);
        list.sort((a, b) => a.ano > b.ano ? -1 : 1);
    } else{
        list.sort((a, b) => a.dia < b.dia ? -1 : 1);
        list.sort((a, b) => a.mes < b.mes ? -1 : 1);
        list.sort((a, b) => a.ano < b.ano ? -1 : 1);
    }
    mostrarDespesas(list);
    ordemData++;
};

function ordenarTipo(){
    let list;
    if(filtro == false){
        list = db.recuperarTodasDespesas();
    } else{
        list = ordenarFiltradas;
    }
    //
    if(ordemTipo % 2 == 0){
        list.sort((a, b) => a.tipo < b.tipo ? -1 : 1);
    } else{
        list.sort((a, b) => a.tipo > b.tipo ? -1 : 1);
    }
    mostrarDespesas(list)
    ordemTipo++;
};

function ordenarValor(){
    let list;
    if(filtro == false){
        list = db.recuperarTodasDespesas();
    } else{
        list = ordenarFiltradas;
    }
    //
    if(ordemValor % 2 == 0){
        list.sort((a, b) => a.valor - b.valor);
    } else{
        list.sort((a, b) => b.valor - a.valor);
    }
    mostrarDespesas(list);
    ordemValor++;
};

function tableRes(){
    let widthSmall = screen.width;
    console.log(widthSmall)
    if(widthSmall <= 360){
        document.getElementById('tableRes').className = 'table table-responsive';
    } else{
        document.getElementById('tableRes').className = 'table';
    }
}
