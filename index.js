
// function getRequest(filename, onfunction, responseType = 'text') {
//     var request = new XMLHttpRequest();
//     request.open('GET', filename, true);
//     request.responseType = responseType;
//     request.onload = function() {
//       onfunction(request.response);
//     }
//     request.send();
// }

function postRequest(filename, data_to_send, onResult = null, onError = null, responseType = 'json') {
    var request = new XMLHttpRequest();
    request.open('POST', filename, true);
    request.responseType = responseType;
    request.onload = function() {
      var result = request.response;
      if(result) {
        if(result.status == "error" && onError) onError(result.message);
        else if(onResult) onResult(result.data);
      } else {
        const result = {
          status: "error",
          message: "No response",
          data: null
        }
        if(onError) onError(result.message);
      }
    }
    request.onerror = function() {
      if(onError) onError("An error occurred during the transaction");
    }
    request.send(JSON.stringify(data_to_send));
}

/* -------------------------------------------- */

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: "", password: "", warning: "" };
  }

  handleChange = (e) => {
    if(e.target.type == "password") {
      this.setState({password: e.target.value, warning: ""});
    } else {
      this.setState({user: e.target.value, warning: ""});
    }
  }

  handleClick = (e) => {
    e.preventDefault();

    const user = this.state.user;
    const password = this.state.password;

    if(user == "" && password == "") {
      this.setState({warning: "Fields are empty"});
    } else if(user == "") {
      if(user == "") this.setState({warning: "User name is missing"});
    } else if(password == "") {
      this.setState({warning: "Password is missing"});
    } else {
      const send = {
        type: e.target.name,
        username: user,
        password: password
      };

      postRequest("login.php", send,
        (result) => {
          this.props.onLogin(result);
        },
        (warning) => {
          this.setState({warning: warning});
        }
      );
    }
  }

  render() {
    return(
      <div className="login-wrap">
        <form>
          <input required placeholder="User name" onChange={this.handleChange}/>
          <input required placeholder="Password" type="password" onChange={this.handleChange}/>
          <label>{this.state.warning}</label>
          <button onClick={this.handleClick} name="login">Login</button>
          <button onClick={this.handleClick} name="signup" className="signup">or Sign up</button>
        </form>
      </div>
    );
  }
}

class CategoryPanel extends React.Component {
  render() {
    return(
      <div className="categories">
        <ul>
          { this.props.categories.map(item => (
            <li key={item.id}
                id={item.id}
                onClick={this.props.onClick}>
              <p>{item.name}</p>
              <span>{item.tasks.length}</span>
            </li>
          ))}
        </ul>
        <form className="sticky"
              onSubmit={(e) => this.props.onSubmit(e, this.inputNode)}>
          <input ref={node => this.inputNode = node}
                 placeholder="Add new category"/>
          <button className="fa fa-plus"></button>
        </form>
      </div>
    );
  }
}

class TaskPanel extends React.Component {
  render() {
    if(!this.props.category) {
      return(
        <div className="tasks">
          <div className="category-title">
            <h2>Choose category from menu in the left or add new category.</h2>
          </div>
        </div>
      );
    } else {
      return(
        <div className="tasks">
          <div className="category-title sticky">
            <h2>{this.props.category.name}</h2>
            <span onClick={this.props.onCategoryRemove} className="fa fa-trash-o"></span>
          </div>
          <ul className="body">
            { this.props.category.tasks.map(item => (
              <li key={item.id}>
                <div className={item.completed ? "fa fa-check-square-o check" : "fa fa-square-o check"} onClick={() => this.props.onCheckBoxClick(item.id)}></div>
                <div className={item.completed ? "text line-through" : "text"}>
                  {item.text}
                </div>
                <div className="fa fa-close remove"
                     onClick={() => this.props.onTaskRemove(item.id)}>
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={(e) => this.props.onSubmit(e, this.inputNode)}>
            <input ref={node => this.inputNode = node} placeholder="Add new task"/>
            <button className="fa fa-plus"></button>
          </form>
        </div>
      );
    }
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isSessionActive: true,
                   isUserLogged: false,
                   userInfo: null,
                   categories: [],
                   selectedCategory: null, };
  }

  handleCategorySubmit = (e, node) => {
    e.preventDefault();
    if(!node.value.length) {
      return;
    }

    const newCategory = {
      id: Date.now(),
      name: node.value,
      tasks: []
    };

    node.value = "";

    const send = {
      id: newCategory.id,
      name: newCategory.name,
      user_id: this.state.userInfo.user_id
    };

    postRequest("category_submit.php", send, (result) => {
      console.log(result);
    });

    this.setState({categories: this.state.categories.concat(newCategory),
                   selectedCategory: newCategory});
  }
  handleCategoryClick = (e) => {
    const category = this.state.categories.find(item => item.id == e.target.id);
    
    const send = {
      focus_category_id: category.id,
      user_id: this.state.userInfo.user_id
    }

    postRequest("category_focus.php", send);

    this.setState({selectedCategory: category});
  }
  handleCategoryRemove = () => {
    const selectedCategoryId = this.state.selectedCategory.id;

    var index = this.state.categories.findIndex(item => item.id == selectedCategoryId);
    var categories = [].concat(this.state.categories);
    categories = categories.slice(0, index).concat(categories.slice(index + 1));

    postRequest("category_delete.php", {category_id: selectedCategoryId});

    this.setState({ categories: categories,
                    selectedCategory: null});
  }

  handleTaskSubmit = (e, node) => {
    e.preventDefault();
    if(!node.value.length) {
      return;
    }

    const categories = [].concat(this.state.categories);

    var index = categories.findIndex(item => item.id == this.state.selectedCategory.id);

    const newTask = {
      id: Date.now(),
      text: node.value,
      completed: 0
    };

    const send = {
      id: newTask.id,
      text: newTask.text,
      category_id: this.state.selectedCategory.id
    };

    postRequest("task_submit.php", send);

    node.value = "";

    categories[index].tasks = categories[index].tasks.concat(newTask);

    this.setState({categories: categories});
  }
  handleTaskRemove = (taskId) => {
    var categories = [].concat(this.state.categories);
    var category = this.state.selectedCategory;
    var tasks = this.state.selectedCategory.tasks;
    
    var categoryIndexInArray = categories.findIndex(item => item.id == category.id);
    var taskIndexInArray = tasks.findIndex(item => item.id == taskId);
    
    categories[categoryIndexInArray].tasks = tasks.slice(0, taskIndexInArray).concat(tasks.slice(taskIndexInArray + 1));

    postRequest("task_delete.php", { id: taskId });

    this.setState({categories: categories});
  }
  handleCheckBoxClick = (taskId) => {
    var categories = [].concat(this.state.categories);
    var selectedCategoryId = this.state.selectedCategory.id;

    var categoryIndex = categories.findIndex(item => item.id == selectedCategoryId);
    var taskIndex = categories[categoryIndex].tasks.findIndex(item => item.id == taskId);
    var completed = categories[categoryIndex].tasks[taskIndex].completed;
    categories[categoryIndex].tasks[taskIndex].completed = !completed;

    postRequest("task_completed.php", {task_id: taskId, completed: !completed});

    this.setState({categories: categories});
  }


  componentDidMount() {
    // Try to retrieve user session
    postRequest("login.php", null,
      (result) => {
        if(!result) {
          this.setState({isSessionActive: false});
        } else {
          this.setState({isSessionActive: true});
          this.handleUserLogin(result);
        }
      }
    );
  }

  handleUserLogin = (userInfo) => {
    console.log(userInfo);

    postRequest("category.php", {user_id: userInfo.user_id},
      (result) => {
        console.log(result);

        var category = result.categories.find(item => item.id == userInfo.focus_category_id);

        this.setState({isUserLogged: true,
                       isSessionActive: true,
                       userInfo: userInfo,
                       categories: result.categories,
                       selectedCategory: category});
      }
    );
  }
  handleUserLogout = () => {
    console.log("Logging out");
    postRequest("logout.php", null,
      (result) => {
        this.setState({isUserLogged: false,
                       isSessionActive: false,
                       selectedCategory: null });
      }
    );
  }

  render() {
    if(this.state.isSessionActive) {
      if(this.state.isUserLogged) {
        return(
          <div className="app">
            <div className="logout" onClick={this.handleUserLogout}>Logout</div>
            <CategoryPanel categories={this.state.categories}
                           onSubmit={this.handleCategorySubmit}
                           onClick={this.handleCategoryClick}/>
            {/* TODO: handleEvent function? */}
            <TaskPanel category={this.state.selectedCategory}
                       onSubmit={this.handleTaskSubmit}
                       onCategoryRemove={this.handleCategoryRemove}
                       onTaskRemove={this.handleTaskRemove}
                       onCheckBoxClick={this.handleCheckBoxClick}/>
          </div>
        );
      } else {
        // Show blank screen while logging is being processed
        return <div className="app"></div>;
      }
    } else {
      return <LoginForm onLogin={this.handleUserLogin}/>;
    }
  }
}


ReactDOM.render(<TodoApp/>, document.getElementById("root"));