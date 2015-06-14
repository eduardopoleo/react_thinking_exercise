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
//Note about data flow.
// Only by setting the this.state we are just declaring that that specific property is a state
// but we are still not making it dynamic. We have to:
  // define the events that will make that state to change 
  // use set.state to effectively change setState() of the component
  // when there are changes is when we have to define the events handlers!! and the refs!!
var FilterableProductTable = React.createClass({
  // return can be used either way depending on the actual 
  // value that is returned. In this case I am returning a 
  // hash so it makes sense to use curly braces
  // The minimal info required to determined the state of our system
  // are the search term and the check-box value. Everything else can be updated from this
  // The state is better defined on the top level component and passed in as props to 
  // the inner resources. This is what is known as one-way data flow
    // IMP: states do not come from anywhere like props! 
  // But in turn we have to set an initial state so that the thing do not crash on the first run  
  // So far you do not get the data from a file because we are not using ajax... so that is why we need
  // to hard coded 
  handleUserInput: function(filterText, inStockOnly){
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    });
  },
  //Ajax post boolean values as strings so we have to check the values 
  // as "true" or "false"
  handleProductSubmit: function(product){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: product,
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
//
  loadProductsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function(){
    this.loadProductsFromServer();
    setInterval(this.loadProductsFromServer, this.props.pollInterval);
  },

  getInitialState: function(){
   return{
     data: [],
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
         onUserInput={this.handleUserInput} 
        />
        <ProductTable
         products = {this.state.data}
         filterText = {this.state.filterText}
         inStockOnly={this.state.inStockOnly}
        />
        <ProductForm onProductSubmit={this.handleProductSubmit} />
      </div>
    );
  }
});

var SearchBar = React.createClass({
  handleChange: function(){
    this.props.onUserInput(
      this.refs.filterTextInput.getDOMNode().value,
      this.refs.inStockOnlyInput.getDOMNode().checked
    );
  },

  render: function() {
    return (
      <form>
        <input
          type='text'
          placeholder='Search product'
          value={this.props.filterText}
          ref='filterTextInput'
          onChange={this.handleChange}
        />

        <br />
        <p>
          <input
            type='checkbox'
            value={this.props.inStockOnly}
            ref='inStockOnlyInput'
            onChange={this.handleChange}
          />
          {' '}
           Only show products in stock
         </p>
      </form>
    );
  }
});

var ProductForm = React.createClass({

  handleSubmit: function(e){
    e.preventDefault();
    var category = React.findDOMNode(this.refs.category).value.trim();
    var price = React.findDOMNode(this.refs.price).value.trim();
    var name = React.findDOMNode(this.refs.name).value.trim();
    var stocked = React.findDOMNode(this.refs.stocked).checked;

    if (!category || !price || !name){
      return;
    }
    this.props.onProductSubmit({category: category, price: price, name: name, stocked: stocked});

    React.findDOMNode(this.refs.category).value = '';
    React.findDOMNode(this.refs.price).value = '';
    React.findDOMNode(this.refs.name).value = '';
    return;
  },

  //When defining a form what elements go inside
  // what are you going to do with those elements
  //
  render: function(){
    return(
      <form className="productsForm" onSubmit={this.handleSubmit}>
        <input type='text' placeholder='product category' ref="category" />
        <input type='text' placeholder='set price' ref="price" />
        <input type='text' placeholder='name your product' ref="name" />
        <input type='checkbox' ref="stocked" />
        <input type='submit' value="Post" />
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
      if (product.category != last_category){
        rows.push(<CategoryRow category={product.category} />)
      }

      if (product.name.indexOf(this.props.filterText) === -1 || (this.props.inStockOnly && !product.stocked)){
        return;
      }
            rows.push(<ProductRow name = {product.name} price = {product.price} stocked = {product.stocked} /> );
      last_category = product.category;
      //What does bind do? Why does the app breaks without it?
    }.bind(this));

    //how come this stuff gets parse out properly in here if it is passed as an array
    //We can not comment inside react components, it actually gets display in the 
    //browser
    //IMP: How does this works <tbody>{rows}</body>? is an array that is passed in? 
    // This a bit of black magic
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var CategoryRow = React.createClass({
  render: function() {
    return (
      <tr><td><strong>{this.props.category}</strong></td></tr>
    );
  }
});

var ProductRow = React.createClass({
  render: function() {
    if (this.props.stocked === "true"){
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

React.render(<FilterableProductTable url='products.json' pollInterval={2000} />, document.getElementById('content') )
