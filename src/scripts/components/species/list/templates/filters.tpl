<li class="table-view-cell">
  <a class="collapsed" data-toggle="collapse" href="#favourites" aria-controls="favourites">
    Favourites
  </a>
  <div id="favourites" class="collapse">
    <ul class="list">
      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="favourite"
          <%- obj['favourite'] ? 'checked' : ''%>>
        </label>
        My favourites only
      </li>
    </ul>
  </div>
</li>
<li class="table-view-cell">
  <a class="collapsed" data-toggle="collapse" href="#type" aria-controls="type">
    Type
  </a>
  <div id="type" class="collapse">
    <ul class="list">
      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="grass"
          <%- obj['grass'] ? 'checked' : ''%>>
        </label>
        Grasses
      </li>
      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="flower"
          <%- obj['flower'] ? 'checked' : ''%>>
        </label>
        Flowers
      </li>
    </ul>
  </div>
</li>
<li class="table-view-cell">
  <a class="collapsed" data-toggle="collapse" href="#colour" aria-controls="colour">
    Colour
  </a>
  <div id="colour" class="collapse">
    <ul class="list">
      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="yellow"
          <%- obj['yellow'] ? 'checked' : ''%>>
        </label>
        Yellow
      </li>

      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="purple"
          <%- obj['purple'] ? 'checked' : ''%>>
        </label>
        Purple
      </li>

      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="white"
          <%- obj['white'] ? 'checked' : ''%>>
        </label>
        White
      </li>

      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="green"
          <%- obj['green'] ? 'checked' : ''%>>
        </label>
        Green
      </li>

      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="blue"
          <%- obj['blue'] ? 'checked' : ''%>>
        </label>
        Blue
      </li>

      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="orange"
          <%- obj['orange'] ? 'checked' : ''%>>
        </label>
        Orange
      </li>

      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="red"
          <%- obj['red'] ? 'checked' : ''%>>
        </label>
        Red
      </li>

      <li class="item item-checkbox item-small">
        <label class="checkbox">
          <input type="checkbox" value="pink"
          <%- obj['pink'] ? 'checked' : ''%>>
        </label>
        Pink
      </li>
    </ul>
  </div>
</li>
