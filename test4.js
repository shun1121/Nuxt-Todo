let array = [
    { content: "test1", created: "2021-03-04 21:00", state: "doing" },
    { content: "test2", created: "2021-03-04 21:00", state: "pending" },
    { content: "test3", created: "2021-03-04 20:00", state: "done" },
    { content: "test3", created: "2021-03-04 20:00", state: "doing" }
]

let arr = []
array.forEach(item => {
    if (item.state == "doing") {
        arr.push(item)
    }
})

console.log(arr)




