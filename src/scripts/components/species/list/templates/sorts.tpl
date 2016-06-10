<label class="item item-radio item-small">
  <input type="radio" name="group" value="common"
  <%- !_.keys(obj).length || obj['common'] ? 'checked' : ''%>>
  <div class="radio-content">
    <div class="item-content">
      Common Name
    </div>
    <i class="radio-icon icon-check"></i>
  </div>
</label>

<label class="item item-radio item-small">
  <input type="radio" name="group" value="common-reverse"
  <%- obj['common-reverse'] ? 'checked' : ''%>>
  <div class="radio-content">
    <div class="item-content">
      Common Name Reverse
    </div>
    <i class="radio-icon icon-check"></i>
  </div>
</label>

<label class="item item-radio item-small">
  <input type="radio" name="group" value="scientific"
  <%- obj['scientific'] ? 'checked' : ''%>>
  <div class="radio-content">
    <div class="item-content">
      Scientific Name
    </div>
    <i class="radio-icon icon-check"></i>
  </div>
</label>

<label class="item item-radio item-small">
  <input type="radio" name="group" value="scientific-reverse"
  <%- obj['scientific-reverse'] ? 'checked' : ''%>>
  <div class="radio-content">
    <div class="item-content">
      Scientific Name Reverse
    </div>
    <i class="radio-icon icon-check"></i>
  </div>
</label>
