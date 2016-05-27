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
    <input type="radio" name="group" value="Cultivated Strip / Block" <%- obj['Cultivated Strip / Block'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Cultivated Strip / Block
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Conservation headland" <%- obj['Conservation headland'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Conservation headland
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Wild bird seed / Game cover" <%- obj['Wild bird seed / Game cover'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Wild bird seed / Game cover
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Wildflower / Clover rich margin" <%- obj['Wildflower / Clover rich margin'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Wildflower / Clover rich margin
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Grass margin / corner" <%- obj['Grass margin / corner'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Grass margin / corner
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Crop" <%- obj['Crop'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Crop
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Stubble" <%- obj['Stubble'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Stubble
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Track / gateway" <%- obj['Track / gateway'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Track / gateway
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Grassland" <%- obj['Grassland'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Grassland
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Other" <%- obj['Other'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Other
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>
</div>

