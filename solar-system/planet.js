function Planet(pos, vel, size, mass, image, imageSrc, name, simulationSpeed)
{

  this.ratioDistance = 1.971 * Math.pow(10, 10);

  this.pos = pos;
  this.velocity = vel;
  this.size = size;
  this.drawSize = size / this.ratioDistance;
  this.mass = mass;
  this.image = image;
  this.imageSrc = imageSrc;
  this.name = name;
  this.simulationSpeed = simulationSpeed;
  this.trace = [];
  this.traceSize = 10000;

  this.setSimulationSpeed = function(newSimulationSpeed)
  {
    this.simulationSpeed = newSimulationSpeed;
  }

  this.getVelocity = function()
  {
    return this.velocity;
  }

  this.setVelocity = function(newVelocity)
  {
    this.velocity = newVelocity;
  }

  this.updateVelocity = function(velocity)
  {
    this.velocity = this.velocity.add(velocity);
  }

  this.move = function()
  {
    let tracePoint = this.pos.div(this.ratioDistance);

    // Delete eventual cyclic trace
    if (this.trace.length > 10)
    {
      let diff = new Vector(this.trace[0].getX() - tracePoint.getX(),
                            this.trace[0].getY() - tracePoint.getY())
      let distance = Math.sqrt(Math.pow(diff.getX(), 2) + Math.pow(diff.getY(), 2));
      if (distance < 0.5)
      {
        this.trace.splice(0, 1);
      }
    }

    // Delete expired trace
    let ratioSpeed = 5 * Math.pow(10, 11) / Math.pow(this.velocity.getLength(), 2);
    if (this.trace.length > ratioSpeed)
    {
      this.trace.splice(0, 1);
    }

    // Create new trace point
    if (this.trace.length > 0)
    {
      let diff = new Vector(this.trace[this.trace.length-1].getX() - tracePoint.getX(),
                            this.trace[this.trace.length-1].getY() - tracePoint.getY())
      let distance = Math.sqrt(Math.pow(diff.getX(), 2) + Math.pow(diff.getY(), 2));
      if (distance > 0.2)
      {
        this.trace.push(tracePoint);
      }
    } else
    {
      this.trace.push(tracePoint);
    }

    this.pos.setX(this.pos.getX() + this.velocity.getX() * this.simulationSpeed);
    this.pos.setY(this.pos.getY() + this.velocity.getY() * this.simulationSpeed);
  }

  this.getTrace = function()
  {
    return this.trace;
  }

  this.setName = function(newName)
  {
    this.name = newName;
  }

  this.getName = function()
  {
    return this.name;
  }

  this.setImageSrc = function(newImageSrc)
  {
    this.imageSrc = newImageSrc;
  }

  this.getImageSrc = function()
  {
    return this.imageSrc;
  }

  this.setPos = function(newPos)
  {
    this.pos = new Vector(newPos.getX(), newPos.getY());
  }

  this.getPos = function()
  {
    return this.pos;
  }

  this.setSize = function(newSize)
  {
    this.size = newSize;
    this.drawSize = newSize / this.ratioDistance;
  }

  this.getSize = function()
  {
    return this.size;
  }

  this.getDrawSize = function()
  {
    return this.drawSize;
  }

  this.setMass = function(newMass)
  {
    this.mass = newMass;
  }

  this.getMass = function()
  {
    return this.mass;
  }

  this.setImage = function(newImage)
  {
    this.image = newImage;
  }

  this.getImage = function()
  {
    return this.image;
  }

  this.getCollisionX = function()
  {
    return this.pos.getX() / this.ratioDistance;
  }

  this.getCollisionY = function()
  {
    return this.pos.getY() / this.ratioDistance;
  }

  this.getDrawX = function()
  {
    return (this.pos.getX() / this.ratioDistance) - (this.drawSize / 2);
  }

  this.getDrawY = function()
  {
    return (this.pos.getY() / this.ratioDistance) - (this.drawSize / 2);
  }

}
