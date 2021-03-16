<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1>Todo Application</h1>
        <div class="addArea">
          <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="6">
              <v-text-field name="addName" v-model="content" placeholder="Put in a task here"></v-text-field>
            </v-col>
            <!-- <input type="text" name="addName" v-model="content" placeholder="Put in a task here"> -->
            <v-col cols="1">
            <button @click="insert" class="button post">Post</button>
            </v-col>
          </v-row>
        </div>
        <div class="Filter">
          <button class="button" @click="flag_reset">All</button>
          <button class="button" @click="select('pending')">Pending</button>
          <button class="button" @click="select('doing')">Doing</button>
          <button class="button" @click="select('done')">Done</button>
          <!-- <button onclick="return confirm('外部のページへ移動します。よろしいですか？')">ボタンを押して下さい</button> -->
        </div>
        <table class="Lists">
          <thead>
            <tr>
              <th>Task</th>
              <th>Time</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in displayData" :key="index">
              <td>{{ item.content }}</td>
              <td>{{ item.created }}</td>
              <td>
                <button class="button state"
                  @click="changeState(item)"
                >
                  {{ item.state }}
                </button>
              </td>
              <td><button class="button delete" @click="remove(item)">Delete</button></td>
              <!-- 上のdeleteで使ってるremoveメソッドに引数itemを与えている。これが下のremove:function(todo){}のtodoと同じ -->
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "../plugins/firebase.js";
export default {
  data: function() {
    return {
      todos: [
        { content: 'test1', created: '2021-03-04 21:00', state: 'doing' },
        { content: 'test2', created: '2021-03-04 21:00', state: 'pending' },
        { content: 'test3', created: '2021-03-04 20:00', state: 'done' },
      ],
      state: [
        { level: 0, label: "pending" },
        { level: 1, label: "doing" },
        { level: 2, label: "done" },
      ],
      content: "",
      find_state: "",
      find_flag: false,
      data: [],
      items: [],
      num: 0
    }
  },

  computed: {
    displayData: function() {
      if (this.find_flag) {
        let arr = []
        for (let i = 0; i < this.todos.length; i++) {
          const todo = this.todos[i]
          if (this.find_state == todo.state) {
            arr.push(todo)
            console.log(todo)
            return arr
          }
        }
      } else {
        this.data = this.todos
        console.log(this.data)
        return this.data
      }
    }
  },

  methods: {
    insert() {
        if (this.content != "") {
          let time = new Date()
          let year = time.getFullYear()
          let month = time.getMonth()+1
          let date = time.getDate()
          let hour = time.getHours()
          let minute = time.getMinutes()
          let now = year + '-' + month + '-' + date + '-' + hour + ':' + minute 
          this.todos.push({ content: this.content, created: now, state: 'doing' })
          this.content = ""
        }
    },

    remove(task) {
      for (let i = 0; i < this.todos.length; i++) {
        // console.log(task.state)
        const todo = this.todos[i]
        if (task.content == todo.content && task.created == todo.created) {
          if (confirm(todo.content + "を削除しますか？")) {
            this.todos.splice(i,1)
            return
          }
        }
      }
    },

    select(State) {
      this.find_flag = true
      this.find_state = State
      for (let i = 0; i < this.todos.length; i++) {
        if (State == this.todos[i].state) {
          console.log(this.todos[i].content)
        }
      }
    },

    changeState(item) {
      let currentState = 0
      for (let i = 0; i < this.state.length; i++) {
        if (item.state == this.state[i].label) {
          currentState = this.state[i].level
        }
      }
      // console.log("----------")
      // console.log(currentState)
      currentState++
      if (currentState >= this.state.length) {
          currentState = 0
      }
      // console.log("------a----")
      // console.log(item.state)
      // console.log("------b----")
      item.state = this.state[currentState].label
      return
    },
    
    flag_reset() {
      this.find_flag = false
    },

    // async changeProcess() {
    //   let result = firebase
    //     .firestore()
    //     .collection("tasks")
    //     .doc("2");

    //   let mai = await result.get()//ここまでは同期処理として進めておく。
    //   let num = mai.data()//ここからはawaitをかけなくてもdata()をみることができる。
    //   console.log("num",num)

    //   result
    //     .get()
    //     .then(doc => {
    //       if (!doc.exists) {
    //         console.log("No such document!");
    //       } else {
    //         console.log("こここ")
    //         console.log(doc.data());
    //       }
    //     }).catch(err => {
    //       console.log("not found");
    //     });

    //   await result.set({
    //     content: "Alan",
    //     created: "Mathison",
    //     state: "Turing",
    //     num: 2
    //   });

    //   console.log("result", result);
    // },
  }
}
</script>
<style>
h1 {
  text-align: center;
  margin-top: 30px;
}
.post {
  padding: 5px 10px;
  border: 1px solid black;
  margin-top:10px;
}
.Filter {
  text-align: center;
  margin-top: 15px;
}
.Filter .button {
  padding: 5px 10px;
  margin-left: 3px;
  border: 1px solid black;
}
.state {
  padding: 5px 10px;
  margin-left: 3px;
  border: 1px solid black;
}
.Lists {
  margin: 0 auto;
  margin-top: 15px;
}
.delete {
  /* color: red;
  border: 2px solid red; */
  margin-left: 2px;
  padding: 5px 10px;
  color:red;
  border: 1px solid red;
} 
</style>


