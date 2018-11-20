function Vector(x, y)
{
  this.x = x;
  this.y = y;

  this.setX = function(newX)
  {
    this.x = newX;
  }

  this.getX = function()
  {
    return parseFloat(this.x);
  }

  this.setY = function(newY)
  {
    this.y = newY;
  }

  this.getY = function()
  {
    return parseFloat(this.y);
  }

  // Norme du vecteur
  this.getLength = function()
  {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  // Adition de vecteurs
  this.add = function(vector)
  {
    return new Vector(this.x + vector.getX(),
                      this.y + vector.getY());
  }

  // Divison de vecteurs
  this.div = function(scalar)
  {
    if (scalar != 0)
    {
      return new Vector(this.x / scalar,
                        this.y / scalar);
    } else
    {
      return new Vector(this.x, this.y);
    }
  }

  // Racine du vecteur
  this.root = function()
  {
    let signX = this.x > 0 ? 1 : -1;
    let signY = this.y > 0 ? 1 : -1;
    return new Vector(signX * Math.sqrt(Math.abs(this.x)),
                      signY * Math.sqrt(Math.abs(this.y)));
  }

  // Multiplication de vecteurs
  this.mult = function(scalar)
  {
    return new Vector(this.x * scalar,
                      this.y * scalar);
  }

}
