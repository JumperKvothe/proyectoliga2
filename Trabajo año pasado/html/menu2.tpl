

<div class="row">

    	<div class="col-33 center">
  			<label>Teléfono</label>
  		</div>
  		<div class="col-33 center">
  			<label>Foto perfil</label>
  		</div>
		  <div class="col-33 center">
  			<label>Dirección</label>
  		</div>
  	</div>
  <div class="row">
    	<div class="col-33">
  			<input type="text" name="Teléfono" pattern="[0-9]{9}" required>
  		</div>  		
  		<div class="col-33 center mtop">
  			<input type="file" name="Imagen"/>
  		</div>
		  <div class="col-33">
  			<input type="text" placeholder="Ej: C/HastaLuegoLucas 16 2ºB" name="Dirección" pattern="[A-Za-z 0-9/ºª:ç|]{1,}" required><br>
  		</div>
  	</div>
  <div class="row">
        <div class="col-33 center">
        <label>Instagram</label>
    </div>
        <div class="col-33 center">
        <label>Email</label>
    </div>
    <div class="col-33 center">
        <label>Facebook</label>
    </div></div>
    <div class="row">
        <div class="col-33">
        <input type="text" name="Instagram" pattern="@([A-Za-z._0-9]{1,})">
    </div>
      <div class="col-33">
        <input type="text" name="Email" pattern="[A-z0-9._-]{1,}@[A-z0-9._-]{1,}[.][a-zA-Z]{2,6}" required>
      </div>
    <div class="col-33">
        <input type="text" name="Facebook" pattern="[A-Za-z 0-9/ºª:ç|]{1,}">	
    </div></div>

	<div class="row">
		</div class="col-100">
		<br><input type="submit" name="registrodatos" value="Enviar">
		</div></div>
  
</form>
</div>
</body>
</html>