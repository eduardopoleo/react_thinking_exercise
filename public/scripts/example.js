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
  // return can be used either way depending on the actual 
  // value that is returned. In this case I am returning a 
  // hash so it makes sense to use curly braces

  // The minimal info required to determined the state of our system
  // are the search term and the checkbox value. Everything else can be updated from this
  // The state is better defined on the top level component and passed in as props to 
  // the inner resources. This is what is known as one-way data flow

  // IMP: states do not come from anywhere like props! 
  // But in turn we have to set an initial state so that the thing do not crash on the first run  
  
  getInitialState: function(){
   return{
     filterText: '',
     inStockOnly: false
   }; 
  },
  //Remember that methods should be separated by comas.
  render: function() {
    return (
      <div className='filterable-table'>
        <SearchBar
         filterText = {this.state.filterText}
         inStockOnly={this.state.inStockOnly}
        />
        <ProductTable
         products = {this.props.products}
         filterText = {this.state.filterText}
         inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
});

var SearchBar = React.createClass({
  render: function() {
    return (
      <form>
        <input type='text' placeholder='Search product' value = {this.props.filterText}> </input>
        <br />
        <input type='submit'> </input>
        <br />
        <input type='checkbox' value={this.props.inStockOnly}>Only show products in stock</input>
      </form>
    );
  }
});

var ProductTable = React.createClass({
  //I use {} only for js expressions that go into
  // child elements and components attributes
  // indexOf returns the index where the pass string is located in the caller
  // it returns -1 is the string passed is not in the caller
  render: function() {
    var rows = [];
    var last_category = '';
    this.props.products.forEach(function(product){
      if (product.name.indexOf(this.props.filterText) === -1 || (this.props.inStockOnly && !product.stocked)){
        return;
      }
      if (product.category != last_category){
        rows.push(<CategoryRow category={product.category} />)
      }
      rows.push(<ProductRow name = {product.name} price = {product.price} stocked = {product.stocked} /> );
      last_category = product.category;
      //What does bind do? Why does the app breaks without it?
    }.bind(this));

    //how come this stuff gets parse out properly in here if it is passed as an array
    //We can not comment inside react components, it actually gets display in the 
    //browser
    return (
      <table>
        <thead>
          <th>Name</th>
          <th>Price</th>
        </thead>
        <tbody> {rows} </tbody>
      </table>
    );
  }
});

var CategoryRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td><strong>{this.props.category}</strong></td>
      </tr>
    );
  }
});

var ProductRow = React.createClass({
  render: function() {
    if (this.props.stocked === true){
      var nameStyle = {
        color: 'black'
      }
    }else{
      var nameStyle ={
        color: 'red' 
      }
    };
    return (
      <tr>
        <td style={nameStyle}>{this.props.name}</td>
        <td>{this.props.price}</td>
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

React.render(<FilterableProductTable products = {PRODUCTS} />, document.getElementById('content') )
