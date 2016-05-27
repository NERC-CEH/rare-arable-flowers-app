<div class="info-message">
  <p>Please pick the life stage.</p>
</div>

<div class="list">
  <label class="item item-radio">
    <input type="radio" name="group" value="default"  <%- !_.keys(obj).length || obj['default'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Not recorded
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Vegetative" <%- obj['Vegetative'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Vegetative
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Flowering" <%- obj['Flowering'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Flowering
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="In Seed" <%- obj['In Seed'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        In Seed
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>
</div>