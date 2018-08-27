function Personagem(x, cor, ehBot, img)
{
	this.imgPeao = img;

	this._presoSOI = 0;
	this.felicidade = 100;
	this._dinheiro = 25;
	this.indexTerrenoAtual = 0; //o terreno em que ele se encontra
	this.vivo = true;

	this.ehBot = ehBot;

	this.x = x;

	this.cor = cor;

	this.propriedades = new Array(0);
}


//PROPRIEDADES
Personagem.prototype.adicionarTerrenoAPropriedades = function(nomeTerreno)
{
	//aumenta vetor e adiciona na ultima posicao
	this.propriedades[this.propriedades.length] = nomeTerreno;
}

Personagem.prototype.tirarTodasPropriedades = function()
{
	this.propriedades = new Array(0);
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

const NUMERO_TOTAL_TERRENOS = 17;


//MUDAR ATRIBUTOS COMUNS
Personagem.prototype.andarTerrenos = function(nTerrenos)
{
	this.indexTerrenoAtual += nTerrenos;

	if(this.indexTerrenoAtual >= NUMERO_TOTAL_TERRENOS)
	{
		this.indexTerrenoAtual -= NUMERO_TOTAL_TERRENOS;
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