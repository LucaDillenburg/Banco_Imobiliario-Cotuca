function Personagem()
{
	this.presoSOI = 0;
	this.felicidade = 100;
	this.dinheiro = 30;
	this.pos = 0;
	this.vivo = true;
}


//GETTERS AND SETTERS
Personagem.prototype.getDinheiro = function()
{
	return parseFloat(this.dinheiro.toFixed(2));
}

Personagem.NUMERO_TOTAL_CASAS = 17;


//MUDAR ATRIBUTOS COMUNS
Personagem.prototype.andarCasas = function(nCasas)
{
	this.pos += nCasas;

	if(this.pos >= this.NUMERO_TOTAL_CASAS)
		this.pos -= this.NUMERO_TOTAL_CASAS;
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
	this.dinheiro += qtd;

	if(this.dinheiro < 0)
		this.vivo = false;

	return (this.dinheiro>=0);
}


//PRISAO
Personagem.prototype.estahPreso = function()
{
	return (this.presoSOI > 0);
}

Personagem.prototype.prender = function()
{
	this.presoSOI = 3;
}

Personagem.prototype.soltarUsuario = function()
{
	this.presoSOI = 0;
}

Personagem.prototype.diminuirPrisao = function()
{
	this.presoSOI--;
}


//TESTE
Personagem.prototype.printPers = function()
{
	alert("Vida: "+this.vida+", Dinheiro: "+this.dinheiro);
}