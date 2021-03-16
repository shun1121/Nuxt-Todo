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
            <tr v-for="(item, index) in items" :key="index">
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
            <!-- <div>{{ data }}</div> -->
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
      num: 0,
      newNum: "",
    }
  },
  async mounted() {
    this.data = await firebase
      .firestore()
      .collection("tasks")
      .get()
    console.log(this.data)
    // if (this.find_flag) {
      this.data.forEach((item) => {
      // console.log(item.data().state)
        const obj = item.data();
        console.log(obj)
        if (obj.state == this.find_state) {
          this.items.push(obj)
          console.log(array)
          console.log("same state")
        } else {
          console.log("different state")
        }
        console.log("++++++++++")
      });
    // } else {
      console.log("aaaaaaaaa")
      await firebase
      .firestore()
      .collection("tasks")
      .onSnapshot((doc) => {
        this.items.splice(0, this.items.length)//itemsの中身を全て消す。
        doc.forEach((item) => {
          const obj = item.data();
          // console.log(obj)
          this.items.push({
            content: obj.content,
            created: obj.created, 
            state: obj.state, 
            num: obj.num
          });
          this.items.sort(function(a, b) {
            if (a.created > b.created) {
              return -1;
            } else {
              return 1;
            }
          });
        });
        //↓ これがないとデータが残ったままリロードしたとき、num=1のものを変更してしまう。
        // if (this.num === 0) {
        //   this.num = this.items.length;
        // }
      });
    // }
  },

  // computed: {
  //   displayData: function() {
  //     if (this.find_flag) {
  //       let arr = []
  //       for (let i = 0; i < this.todos.length; i++) {
  //         const todo = this.todos[i]
  //         if (this.find_state == todo.state) {
  //           arr.push(todo)
  //           console.log(todo)
  //           return arr
  //         }
  //       }
  //     } else {
  //       this.data = this.todos
  //       // console.log(this.data)
  //       return this.data
  //     }
  //   }
  // },

  methods: {
    async insert() {
      if (this.content != "") {
        this.num++
        let time = new Date()
        let year = time.getFullYear()
        let month = ('00' + (time.getMonth()+1)).slice(-2)
        let date = ('00' + time.getDate()).slice(-2)
        let hour = ('00' + time.getHours()).slice(-2)
        let minute = ('00' + time.getMinutes()).slice(-2)
        let second = ('00' + time.getSeconds()).slice(-2)
        let now = year + '-' + month + '-' + date + '-' + hour + ':' + minute + ':' + second
        await firebase
        .firestore()
        .collection("tasks")
        .doc(String(this.num))
        .set({ content: this.content, created: now, state: 'pending', num: this.num })
        // this.todos.push({ content: this.content, created: now, state: 'doing' })
        this.content = ""
        this.newNum = this.num
      }
    },

    remove(task) {
      // console.log(task)
      let removeNum = task.num
      console.log(task.num)
      firebase
      .firestore()
      .collection("tasks")
      .doc(String(removeNum))
      .delete().then(() => {
        console.log("Document successfully deleted!");
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
    },

    async select(State) {
      // const getRef = firebase.firestore().collection('tasks')
      // const firestoreData = await getRef.get()
      // console.log("----------")
      // let array = []
      // firestoreData.forEach((item) => {
      //   // console.log(item.data().state)
      //   const obj = item.data();
      //   if (obj.state == State) {
      //     array.push(obj)
      //     console.log(array)
      //     console.log("same state")
      //   } else {
      //     console.log("different state")
      //   }
      //   console.log("++++++++++")
      //   // console.log(obj)
      // });  
     
      this.find_flag = true
      this.find_state = State
      console.log(this.find_state)
      // for (let i = 0; i < this.todos.length; i++) {
      //   if (State == this.todos[i].state) {
      //     // console.log(this.todos[i].content)
      //   }
      // }
    },

    changeState(item) {
      let currentState = 0
      for (let i = 0; i < this.state.length; i++) {
        if (item.state == this.state[i].label) {
          currentState = this.state[i].level
        }
      }
      currentState++
      if (currentState >= this.state.length) {
          currentState = 0
      }
      item.state = this.state[currentState].label
      return
    },
    
    flag_reset() {
      this.find_flag = false
    }
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