package com.beangotown.component

import android.annotation.SuppressLint
import android.content.Context
import android.os.Message
import android.util.Log
import android.view.ViewGroup.LayoutParams
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient


@SuppressLint("SetJavaScriptEnabled", "ViewConstructor")
class SupportWebView(context: Context, url: String = "") : WebView(context) {
    init {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        webViewClient = SupportWebViewClient()
        webChromeClient = SupportWebChromeClient()
        settings.setSupportMultipleWindows(true)
        if (url.isNotBlank()) {
            loadUrl(url)
        }
    }
}

class SupportWebViewClient : WebViewClient() {
    @Deprecated("Deprecated in Java", ReplaceWith("false"))
    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
        if (url?.contains("openlogin.portkey.finance/social-login") == true) {
            view?.let {
                val context = view.context
                context.forwardToTaskActivity(url)
                MessageBus.registerCallback(
                    generateUniqueID(),
                    createInjectJsResultCallback(webView = view)
                )
            }
            return true
        }
        return false
    }

    override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        view?.let {
            injectJavascript(view)
        }
    }
}

class SupportWebChromeClient : WebChromeClient() {
    override fun onCreateWindow(
        view: WebView?,
        isDialog: Boolean,
        isUserGesture: Boolean,
        resultMsg: Message?
    ): Boolean {
        resultMsg?.let {
            val newWebView = SupportWebView(view!!.context)
            val transport = it.obj as WebView.WebViewTransport
            transport.webView = newWebView
            it.sendToTarget()
        }
        return true
    }
}

fun injectJavascript(webView: WebView) {
    webView.evaluateJavascript(
        "(()=>{\n" +
                "          try {\n" +
                "            if(!window.opener) window.opener = {}\n" +
                "            window.opener.postMessage = obj => {\n" +
                "              window.ReactNativeWebView.postMessage(JSON.stringify(obj));\n" +
                "            };\n" +
                "          } catch (error) {\n" +
                "            alert(JSON.stringify(error));\n" +
                "          }\n" +
                "        })()"
    ) {
        Log.w("SupportWebView", "Inject Javascript result : $it")
    }
}

fun createInjectJsResultCallback(webView: WebView): (String) -> Unit {
    return {
        webView.evaluateJavascript(
            "(()=>{window.ReactNativeWebView.postMessage($it)})()"
        ) {}
    }
}