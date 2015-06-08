/**
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var FilterableProductTable = React.createClass({
  render: function() {
    return (
      <div className='filterable-table'>
        <SearchBar />
        <ProductTable />
      </div>
    );
  }
});

var SearchBar = React.createClass({
  render: function() {
    return (
      <form>
        <input type='text' placeholder='Search product'> </input>
        <br />
        <input type='checkbox'>Only show products in stock</input>
      </form>
    );
  }
});

var ProductTable = React.createClass({
  render: function() {
    // var rows = [];
    // var lastCategory = null;
    // {this.props.products}.forEach(function(product){
    //  if (product.category != lastCategory)
    //   rows.push()

    // });

    return (
      <table>
        <thead>
          <th>Name</th>
          <th>Price</th>
        </thead>
        <tbody>
        //React is actually clever in the sense that knows that 
        //tr and td is what actually should go inside the table body
          <CategoryRow />
          <ProductRow />
        </tbody>
      </table>
    );
  }
});

var CategoryRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>Category name </td>
      </tr>
    );
  }
});

var ProductRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>A product name </td>
        <td>Product price</td>
      </tr>
    );
  }
});


var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

React.render(<FilterableProductTable />, document.getElementById('content') )
