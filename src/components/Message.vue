<template>
    <div class="wrap">
        <div class="mes" :class="{ owner }" v-if="type === 'text'">
            <p>{{ text }}</p>
            <small><strong>{{ date.toLocaleDateString("ru",{day:"numeric", month:"long", hour:"numeric", minute:"numeric"}) }}</strong></small>
        </div>
        <div class="mes" :class="{ owner }" v-if ="type === 'document'">
          <img alt="" :src="docEncode + ',' + docData" id="attch">
          <small><strong>{{ date.toLocaleDateString("ru",{day:"numeric", month:"long", hour:"numeric", minute:"numeric"}) }}</strong></small>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client'
import { mapState } from 'vuex'
export default {
  props: {
    text: String,
    date: Date,
    owner: {
      type: Boolean,
      default: false
    },
    type: String,
    docEncode: String,
    docData: String
  }
}
</script>

<style scoped>
    .wrap{
        display: flex;
        flex-direction: column;
    }
    .mes{
        padding: 1rem;
        width: 60%;
        margin: 0 1rem;
        border-radius: 4px;
        background: #1976d2;
        position: relative;
        margin-bottom: 1rem;
    }
    p{
        margin-bottom: 0 !important;
        -moz-hyphens: auto;
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
    }
    .owner{
        background-color: #fff;
        color:black;
        align-self: flex-end;
    }
    img {
      width: 100%;
      background-size: cover;
    }
</style>
