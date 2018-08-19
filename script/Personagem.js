function Personagem(x)
{
	this._presoSOI = 0;
	this.felicidade = 100;
	this._dinheiro = 30;
	this.pos = 0; //a casa em que ele se encontra
	this.vivo = true;

	this.x = x;
}


//GETTERS AND SETTERS
Personagem.prototype.getDinheiro = function()
{
	return this._dinheiro.toFixed(2);
}

Personagem.prototype.getQtdRodadasFaltam = function()
{
	return this._presoSOI;
}

const NUMERO_TOTAL_CASAS = 17;


//MUDAR ATRIBUTOS COMUNS
Personagem.prototype.andarCasas = function(nCasas)
{
	this.pos += nCasas;

	if(this.pos >= NUMERO_TOTAL_CASAS)
	{
		this.pos -= NUMERO_TOTAL_CASAS;
		return true;
	}
	return false;
}

Personagem.prototype.mudarFelicidade = function(qtd)
{
	this.felicidade += qtd;
	if(this.felicidade > 100)
		this.felicidade = 100;

	if (this.felicidade <= 0)
		this.vivo = false;

	return (this.felicidade>0);
}

Personagem.prototype.mudarDinheiro = function(qtd)
{
	this._dinheiro += qtd;

	if(this._dinheiro < 0)
		this.vivo = false;

	return (this._dinheiro>=0);
}


//PRISAO
Personagem.prototype.estahPreso = function()
{
	return (this._presoSOI > 0);
}

Personagem.prototype.prender = function()
{
	this._presoSOI = 3;
}

Personagem.prototype.soltarUsuario = function()
{
	this._presoSOI = 0;
}

Personagem.prototype.diminuirPrisao = function()
{
	this._presoSOI--;
}


//TESTE
Personagem.prototype._printPers = function()
{
	alert("Vida: "+this.vida+", Dinheiro: "+this.getDinheiro());
}
